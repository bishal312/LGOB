import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function signup(req, res) {
  const { fullName, phoneNumber, password, role } = req.body;
  try {
    if (!fullName || !phoneNumber || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    if (phoneNumber.length !== 10) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const existingUser = await User.findOne({ phoneNumber });
    if (role === "admin") {
      const adminExists = await User.countDocuments({ role: "admin" });
      if (adminExists > 0) {
        return res.status(403).json({ message: "Only one admin allowed" });
      }
    }

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this phone number" });
    }
    const newUser = await User.create({
      fullName,
      phoneNumber,
      password,
      role: role || "customer",
    });
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET_KEY
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // using secure cookies in production
      sameSite: "strict", // prevent cross-site request forgery
    });
    res.status(200).json({
      success: true,
      message: "welcome to the authentication /signup",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  res.status(200).json({ message: "welcome to the authentication /login" });
}
