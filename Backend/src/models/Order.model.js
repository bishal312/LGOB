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
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        stock: {
          type: Number,
          required: true,
          min: 1,
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
      enum: ["Pending" || "Delivery in process" || "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
