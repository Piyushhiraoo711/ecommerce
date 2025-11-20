import Cart from "../model/cartModel.js";
import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";

export const checkout = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty" });
    }


    let totalAmount = 0;
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({
          success: false,
          message: `Product not found in cart item`,
        });
      }

      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          success: false,
          message: `Out of stock for product${item.product.name}`,
        });
      }

      totalAmount += item.product.price * item.quantity;
    }


    const newOrder = new Order({
      user: userId,
      products: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),

      totalAmount,
      orderDate: new Date(),
      status: "pending", 
      paymentStatus: "unpaid",
      paymentMethod : "COD"
    });

    await newOrder.save();

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Checkout error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
