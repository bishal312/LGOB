import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getProductDetail } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/:id", protectRoute,getProductDetail);



export default router;