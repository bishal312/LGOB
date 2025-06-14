import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  addToCart,
  clearCart,
  getCartProduct,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCartProduct);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, removeFromCart);
router.put("/:id", protectRoute, clearCart);

export default router;
