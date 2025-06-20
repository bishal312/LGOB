import { Cart } from "../models/cart.model.js";
import User from "../models/User.model.js";

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

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    const adminUser = await User.findById( userId );
    if (!adminUser) {
      let cart = await Cart.findOne({ userId: req.user._id });

      if (!cart) {
        cart = new Cart({
          userId: req.user._id,
          items: [{ productId, quantity }],
        });
      } else {
        const existingItem = cart.items.find((item) =>
          item.productId.equals(productId)
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ productId, quantity });
        }
      }

      await cart.save();
      res.status(200).json(cart);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add to cart", error: error.message });
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
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to clear cart",
        error: error.message,
      });
  }
};
