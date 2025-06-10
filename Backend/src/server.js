import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import dashBoardRoute from "./routes/dashboard.route.js";
import { connectDb } from './lib/db.js';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5002;

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
  {
    origin: "http://localhost:4200",
    credentials: true
  }
));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashBoardRoute);


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  connectDb()
});
