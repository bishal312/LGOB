import  Order  from "../models/order.model.js";
import Product  from "../models/product.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { items } = req.body; 

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      total += product.price * item.stock;
    }

    const order = new Order({
      userId: req.user._id,
      items,
      totalAmount: total,
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order", error);
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};
