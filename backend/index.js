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
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.get("/test", (req, res) => {
  res.send("API working fine");
});

app.use("/auth", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/cart", cartRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`server is running on PORT${PORT}`);
});
