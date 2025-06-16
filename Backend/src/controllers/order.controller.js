import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const placeOrder = async (req, res) => {
  try {
    const { items, address, location, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    if (
      !address ||
      !location ||
      location.latitude == null ||
      location.longitude == null ||
      !totalAmount
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Address, location and totalAmount are required" });
    }
    const validateItems = [];
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ message: "Invalid productId format" });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });
      }
      const itemsQuantity =
        item.quantity && item.quantity > 0 ? item.quantity : 1;

      validateItems.push({
        productId: product._id,
        stock: itemsQuantity,
      });
    }

    const order = new Order({
      userId: req.user._id,
      items,
      totalAmount,
      address,
      location,
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order", error);
    res
      .status(500)
      .json({ message: "Failed to place order", error: error.message });
  }
};
