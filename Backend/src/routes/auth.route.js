import express from "express";
import { login, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/login", (req, res) => {
  res.status(200).json({ message: "welcome to the authentication"});
});

export default router;