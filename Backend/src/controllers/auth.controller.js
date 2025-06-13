import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { redis } from "../lib/redis.js";
dotenv.config();

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "Lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

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
    const user = await User.create({
      fullName,
      phoneNumber,
      password,
      role: role || "customer",
    });
    // const token = jwt.sign(
    //   { userId: newUser._id, role: newUser.role },
    //   process.env.JWT_SECRET_KEY
    // );

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    // res.cookie("jwt", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // using secure cookies in production
    //   sameSite: (process.env.NODE_ENV === "production" ? "strict" : "Lax"), // prevent cross-site request forgery
    // });
    res.status(200).json({
      success: true,
      message: "user created successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  const { phoneNumber, password } = req.body;
  try {
    if (!phoneNumber || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ phoneNumber });
    console.log(user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid phone number or password" });
    }
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phonenumber or password" });
    }
    if (user && (await user.matchPassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.status(200).json({
        success: true,
        message: "User Logged in Successfully",
        user: {
          _id: user._id,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error occured while login");
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "Lax",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export async function secureAdmin(req, res) {
  try {
    const adminExists = await User.countDocuments({ role: "admin" });

    if (adminExists > 0) {
      return res.status(200).json({ adminExists: true });
    } else {
      return res.status(200).json({ adminExists: false });
    }
  } catch (error) {
    console.error("Error checking admin existence:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
