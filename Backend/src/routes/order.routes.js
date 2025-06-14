import express from "express";
import { placeOrder } from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/place", protectRoute, placeOrder);

export default router;
