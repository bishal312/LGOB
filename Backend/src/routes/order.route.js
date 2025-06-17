import express from "express";
import { autoCompleteAddress, placeOrder } from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/place", protectRoute, placeOrder);
router.post("/autocomplete", protectRoute, autoCompleteAddress);

export default router;
