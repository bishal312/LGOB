import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import dashBoardRoute from "./routes/dashboard.route.js";
import { connectDb } from './lib/db.js';
import productRoute from "./routes/product.routes.js"
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5002;

// Middleware 
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: 'http://localhost:4200', // Note the correct format with ://
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // If using cookies/auth headers
}));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashBoardRoute);
app.use("/api/products", productRoute);

// if(process.env.NODE_ENV === "production"){
//   app.use(express.static(path.join(__dirname,"../frontend/dist")));
//   app.get("*", (req, res)=>{
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
//   });
// }

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  connectDb()
});
