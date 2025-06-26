import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
import { transporter } from "../utils/mailer.js";
import dotenv from "dotenv";
dotenv.config();

export const placeOrder = async (req, res) => {
  try {
    const { items, address, location, totalAmount } = req.body;

    // Validate input
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
      return res.status(400).json({
        success: false,
        message: "Address, location and totalAmount are required",
      });
    }

    const validatedItems = [];

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
      if (product.stock < (item.quantity || 1)) {
        return res
          .status(400)
          .json({ success: false, message: "Insufficient stock" });
      }
      const itemsQuantity =
        item.quantity && item.quantity > 0 ? item.quantity : 1;

      validatedItems.push({
        productId: product._id,
        quantity: itemsQuantity,
      });
    }

    // Create the order
    const order = new Order({
      userId: req.user._id,
      items: validatedItems,
      totalAmount,
      address,
      location,
    });

    await order.save();

    try {
      // Update stock with atomic update
      await Promise.all(
        order.items.map(async (item) => {
          await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: -item.quantity } },
            { new: true }
          );
        })
      );

      // Fetch product details again to show in email
      const orderedItemsHtmlArray = await Promise.all(
        order.items.map(async (item, i) => {
          const product = await Product.findById(item.productId);
          return `<li>Item ${i + 1}: ${product.name} — Qty: ${
            item.quantity
          }</li>`;
        })
      );

      const orderedItemsHtml = orderedItemsHtmlArray.join("");

      // Send order email
      await transporter.sendMail({
        from: '"Lumbini Chyau Organic Bhandar" <Magardadi5@gmail.com>',
        to: "zoneinfinity87@gmail.com",
        subject: `Order placed by ${req.user.fullName}`,
        html: `
          <p>Hello sir,</p>
          <p>You have received a new order from <strong>${address}</strong> by <strong>${req.user.fullName}</strong>.</p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Total:</strong> NPR ${order.totalAmount}</p>
          <p><strong>Items:</strong></p>
          <ul>${orderedItemsHtml}</ul>
        `,
      });

      console.log("Emailed for order");
    } catch (emailError) {
      console.error("Failed to send order email", emailError);
    }

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order", error);
    res
      .status(500)
      .json({ message: "Failed to place order", error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  const { id: orderId } = req.params;
  if (!orderId) {
    return res
      .status(400)
      .json({ success: false, message: "Order Id is required" });
  }
  if (!mongoose.isValidObjectId(orderId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Order Id" });
  }
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (
      order.status === "Delivered" ||
      order.status === "Cancelled" ||
      order.status === "Delivery in process"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel an order",
      });
    }
    await Order.findByIdAndDelete(orderId);
    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};

export const autoCompleteAddress = async (req, res) => {
  const { input } = req.body;

  const response = await fetch(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
        "X-Goog-FieldMask":
          "suggestions.placePrediction.text,suggestions.placePrediction.placeId",
      },
      body: JSON.stringify({
        input,
      }),
    }
  );

  const data = await response.json();
  res.json(data);
};

export const coordinatesMap = async (req, res) => {
  const { placeId } = req.body;

  if (!placeId) {
    return res.status(400).json({ error: "placeId is required" });
  }

  try {
    const response = await fetch(
      `
      https://places.googleapis.com/v1/places/${placeId}?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "formattedAddress,location",
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      res.json(data);
    } else {
      res
        .status(500)
        .json({ error: data.error || "Failed to fetch place details" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orderedProducts = await Order.find({ userId }).populate("items");

    const onlyItems = await Promise.all(
      orderedProducts.map(async (order) => {
        const mappedItems = await Promise.all(
          order.items.map(async (item) => {
            const product = await Product.findById(item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product?.price || 0,
            };
          })
        );

        return {
          items: mappedItems,
          createdAt: order.createdAt,
          totalAmount: order.totalAmount,
          orderId: order._id,
          orderStatus: order.status,
        };
      })
    );

    if (!orderedProducts.length) {
      return res.status(200).json({
        success: true,
        message: "You haven't ordered any items yet!",
        onlyItems: [],
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Your Orders:-", onlyItems });
  } catch (error) {
    console.error("Error while fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your orders",
      error: error.message,
    });
  }
};
