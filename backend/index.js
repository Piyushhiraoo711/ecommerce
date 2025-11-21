import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import {
  adminRoutes,
  cartRoutes,
  orderRoutes,
  productRoutes,
  userRoutes,
} from "./routes/index.js";
import { connectDB } from "./database/db.js";

dotenv.config({});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ecommerce-omega-beryl-93.vercel.app",
      "https://ecommerce-git-main-piyushhiraoo711s-projects.vercel.app",
      "https://ecommerce-i1piy1px3-piyushhiraoo711s-projects.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

const PORT = process.env.PORT || 3000;

app.use("/auth", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/cart", cartRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`server is running on PORT${PORT}`);
});
