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
router.post("/add", protectRoute, addToCart);
router.delete("/remove/:id", protectRoute, removeFromCart);
router.delete("/clear", protectRoute, clearCart);

export default router;
