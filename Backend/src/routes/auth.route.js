import express from "express";

const router = express.Router();

router.post("/signup", (req, res)=> {
  res.status(200).json({ message: "welcome to the authentication"});
});

router.post("/login", (req, res) => {
  res.status(200).json({ message: "welcome to the authentication"});
});

export default router;