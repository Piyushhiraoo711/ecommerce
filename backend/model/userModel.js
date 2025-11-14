import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {},
    lastName: {},
    email: {},
    password: {},
    phone: {},
    address: {},
    role: {},
    otpVerify: {
      type: String,
    },
    otpExpire: {
      type: Date,
    },
    isOtpVerify: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Users", userSchema);
export default User;
