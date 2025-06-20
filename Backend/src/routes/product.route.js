import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getProductDetail, showAllProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/:id", protectRoute,getProductDetail);
router.get("/",protectRoute, showAllProducts);



export default router;