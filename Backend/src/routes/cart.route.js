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
router.delete("/:id", protectRoute, removeFromCart);
router.put("/", protectRoute, clearCart);

export default router;
