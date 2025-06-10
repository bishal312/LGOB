import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",protectRoute, adminRoute, async(req,res)=>{
  try {
    const dashboardData = await getDashboardData();
    const endDate = new Date();
    const startDaate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailySalesData = await getDailySalesData(startDaate, endDate);
    
    res.json({
      dashboardData,
      dailySalesData,
    });
  } catch (error) {
    console.log("Error in dashboard route", error.message);
    res.status(500).json({success: false, message: "Server error:", error:error.message});
  }
});

export default router;