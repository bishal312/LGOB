import express from "express";
import { getProfile, login, logout, secureAdmin, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", protectRoute, getProfile);

router.get("/secureadmin", secureAdmin);



export default router;