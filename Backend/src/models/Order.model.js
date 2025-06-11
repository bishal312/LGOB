import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  totalAmout: {
    type: Number,
    required: true,
    min: 1,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending" || "Delivery in process" || "Delivered"],
    default: "Pending"
  }
},{timestamps:true});

const Order = mongoose.model("Order", orderSchema);
export default Order;