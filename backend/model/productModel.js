import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {},
    description: {},
    price: {},
    category: {},
    brand: {},
    stock: {},
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },

  { timestamps: true }
);

const Product = mongoose.model("Products", productSchema);
export default Product;
