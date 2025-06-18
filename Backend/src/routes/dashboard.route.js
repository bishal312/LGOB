import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { addProduct, deleteProduct, getDetailsByOrderId, getMyProducts, getOrders, updateOrderStatus, updateProduct } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/products",protectRoute, adminRoute, getMyProducts);
router.post("/products", protectRoute, adminRoute, addProduct);
router.put("/products/:id", protectRoute, adminRoute, updateProduct);
router.delete("/products/:id", protectRoute, adminRoute, deleteProduct);

router.get("/orders", protectRoute, adminRoute, getOrders);
router.patch("/orders/:id/status", protectRoute, adminRoute, updateOrderStatus);
router.get("/orders/:orderid", protectRoute, adminRoute, getDetailsByOrderId);



export default router; 