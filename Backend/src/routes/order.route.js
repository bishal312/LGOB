import express from "express";
import { autoCompleteAddress, coordinatesMap, getMyOrders, placeOrder } from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/place", protectRoute, placeOrder);
router.post("/autocomplete", protectRoute, autoCompleteAddress);
router.post("/coordinates", protectRoute, coordinatesMap);
router.get("/getmyorders", protectRoute, getMyOrders);

export default router;
