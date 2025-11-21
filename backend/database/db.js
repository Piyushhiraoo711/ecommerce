import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(process.env.MONGO_URI)
    console.log("MongoDB connection successfully");
  } catch (error) {
    console.log("MongoDB connection failed", error);
  }
};
