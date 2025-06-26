import { Cart } from "../models/cart.model.js";
import User from "../models/User.model.js";

export const addToCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login first" });
    }

    const { productId, quantity } = req.body;
    const userId = req.user.id;
    const qty = parseInt(quantity) || 1;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found or login first" });
    }
    if (user?.role === "admin") {
      return res
        .status(403)
        .json({ message: "Admins are not allowed to add to cart" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: qty }],
      });
    } else {
      const existingItem = cart.items.find((item) =>
        item.productId.equals(productId)
      );

      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        cart.items.push({ productId, quantity: qty });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Added to cart", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add to cart", error: error.message });
  }
};

export const getCartProduct = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId"
    );
    res.status(200).json(cart || { userId: req.user._id, items: [] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get cart", error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id: productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => !item.productId.equals(productId));

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to remove from cart", error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    cart.items = [];
    await cart.save();
    res.status(200).json({ success: false, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};
