import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";

export const createOrder = async (req, res) => {
  try {
    const user = req.user;
    const { products, paymentMethod } = req.body;
    if (!(user && products && paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Somthing is missing",
      });
    }

    let totalAmount = 0;
    for (const item of products) {
      const productData = await Product.findById(item.product);
      if (!productData) {
        return res.status(404).json({
          success: false,
          message: `Product not found ${item.product}`,
        });
      }

      if (productData.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product are limited to stock for ${productData.name}, only ${productData.quantity} are available`,
        });
      }
      totalAmount += productData.price * item.quantity;
    }

    const newOrder = new Order({
      user,
      products: products.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      totalAmount,
      paymentMethod,
      orderDate: new Date(),
      status: "pending",
      paymentStatus: "unpaid",
    });

    await newOrder.save();

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// user can get all their orders
export const getAllMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate("products.product", "name price category")
      .populate("user", "firstName lastName email");

    if (!orders.length)
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// seller and admin can see orders that includes their products
export const getUsersOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const sellerProducts = await Product.find({ createdBy: sellerId }).select(
      "_id"
    );
    const productIds = sellerProducts.map((p) => p._id);

    // if (!sellerProducts.length)
    //   return res.status(404).json({ success: false, message: "You have no products yet" });

    const orders = await Order.find({
      "products.product": { $in: sellerProducts.map((p) => p._id) },
    })
      .populate("user", "firstName lastName email")
      .populate("products.product", "name price category");

    // if (!orders.length)
    //   return res.status(404).json({ success: false, message: "No user orders for your products yet" });

    const filteredOrders = orders.map((order) => ({
      ...order._doc,
      products: order.products.filter((p) =>
        productIds.some((id) => id.equals(p.product._id))
      ),
    }));

    res
      .status(200)
      .json({ success: true, count: orders.length, orders: filteredOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get a order for all
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("user", "name email role")
      .populate("products.product", "name price createdBy");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (
      req.user.role === "user" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (req.user.role === "seller") {
      const ownsProduct = order.products.some(
        (item) => item.product.createdBy.toString() === req.user._id.toString()
      );
      if (!ownsProduct)
        return res.status(403).json({
          success: false,
          message: "You are not authorized for this order",
        });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//seller and admin can update the order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status))
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status" });

    const order = await Order.findById(id).populate("products.product");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (req.user.role === "seller") {
      const ownsProduct = order.products.some(
        (item) => item.product.createdBy.toString() === req.user._id.toString()
      );
      if (!ownsProduct)
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this order",
        });
    }

    order.status = status;
    await order.save();

    res
      .status(200)
      .json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// seller and admin can delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("products.product");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (req.user.role === "seller") {
      const ownsProduct = order.products.some(
        (item) => item.product.createdBy.toString() === req.user._id.toString()
      );
      if (!ownsProduct)
        return res.status(403).json({
          success: false,
          message: "Not authorized to delete this order",
        });
    }

    await order.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
