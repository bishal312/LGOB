import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      latitude: {
        type:Number,
        required: true,
      },
      longitude:{
        type:Number,
        required: true,
      }
    },
    status: {
      type: String,
      enum: ["Pending" || "Delivery in process" || "Delivered" || "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
