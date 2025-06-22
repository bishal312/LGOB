import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imagePublicId:{
      type: String,
      required: [true, "Image public ID is required"],
    }
  },
  {
    timestamps: true,
  }
);
productSchema.index({ name: 1, userId: 1 }, { unique: true }); // Prevent duplicate per user

const Product = mongoose.model("Product", productSchema);
export default Product;
