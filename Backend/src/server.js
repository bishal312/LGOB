import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import dashBoardRoute from "./routes/dashboard.route.js";
import { connectDb } from "./lib/db.js";
import productRoute from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:4000", // Angular app URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If using cookies/auth headers
  })
);
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashBoardRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// if(process.env.NODE_ENV === "production"){
//   app.use(express.static(path.join(__dirname,"../frontend/dist")));
//   app.get("*", (req, res)=>{
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
//   });
// }

//Now arranging the path for static files
// Serve Angular build files
const angularDistPath = path.join(__dirname, "../frontend/lcob/dist/lcob");
console.log("Angular Dist Path:", angularDistPath);
app.use(express.static(angularDistPath));
app.get("/", (req, res) => {
  res.redirect("/home");
});
// Fallback route for Angular
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(angularDistPath, "index.html"));
});
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  connectDb();
});
