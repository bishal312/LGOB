import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      minlength: 10,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    whatsapp_consent: {
      type: Boolean,
      default: false,
    },
    cartItems:[
      {
        quantity: {
          type:Number,
          default:1,
        },
        product: {
          type:mongoose.Schema.Types.ObjectId,
          ref: "Product"
        }
      }
    ],
    role: {
      type: String,
      required:true,
      emun: ["customer", "admin"],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    createdAt:{
      type: Date,
      default:Date.now,
    }
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPasswordCorrect= await bcrypt.compare(enteredPassword, this.password);
  return isPasswordCorrect;
}

const User = mongoose.model("User", userSchema);
export default User;