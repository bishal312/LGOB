import mongoose from "mongoose";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

export const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
      return res.status(400).json({message: "invalid product id"});
    }
    const product = await Product.findById(id);
    if(!product) {
      return res.status(404).json({success:false, message: "Product not found"});
    }
    res.status(200).json({success: true, message:"Product Detail:",product:product});
  } catch (error) {
    console.log("Error fetching Product: ",error);
    res.status(500).json({success: false, message:"Internal Server error"});
  }
};
