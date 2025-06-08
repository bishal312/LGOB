import express from "express";
import { login, logout, secureAdmin, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/secureadmin", secureAdmin);



export default router;