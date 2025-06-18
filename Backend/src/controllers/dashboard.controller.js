import mongoose from "mongoose";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

dotenv.config();

export const addProduct = async (req, res) => {
  try {
    const { name, price, description, image, stock, userId } = req.body;
    const result = await cloudinary.uploader.upload(image, {
      folder: "ecommerce_products",
    });
    const newProduct = new Product({
      name,
      price,
      description,
      userId,
      stock,
      image: result.secure_url,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to upload product" });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetcing products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get products",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findOne({
      _id: req.params.id,
    });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    if (req.body.imageBase64) {
      if (existingProduct.imagePublicId) {
        await cloudinary.uploader.destroy(existingProduct.imagePublicId);
      }

      const newImg = await cloudinary.uploader.upload(req.body.imageBase64, {
        folder: "ecommerce_products",
      });

      req.body.image = newImg.secure_url;
      req.body.imagePublicId = newImg.public_id;

      delete req.body.imageBase64;
    }

    Object.assign(existingProduct, req.body);

    await existingProduct.save();
    res.status(200).json(existingProduct);
  } catch (error) {
    console.log("Error while updating product", error);
    res.status(500).json({ success: false, message: "product Update fail" });
  }
};

export const deleteProduct = async (res, req) => {
  await Product.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });
  res.status(204).end();
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "fullName _id");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
};

export const getDetailsByOrderId = async (req, res) => {
  const { orderid } = req.params;
  try {
    const order = await Order.findById(orderid).populate("userId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch order",
        error: error.message,
      });
  }
};
