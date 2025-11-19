import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";

// user create order only
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
    const productIds = sellerProducts.map((p) => p._id.toString());

    if (!productIds.length) {
      return res.status(200).json({
        success: true,
        count: 0,
        orders: [],
        message: "Seller has no products",
      });
    }

    
    const orders = await Order.find({
      "products.product": { $in: productIds },
    })
      .populate("user", "firstName lastName email")
      .populate("products.product", "name price category images");


    const filteredOrders = orders
      .map((order) => {
        const filteredProducts = order.products.filter((item) => {
        
          if (!item.product) return false;

          return productIds.includes(item.product._id.toString());
        });


        if (!filteredProducts.length) return null;

        return {
          ...order._doc,
          products: filteredProducts,
        };
      })
      .filter(Boolean); 

    res.status(200).json({
      success: true,
      count: filteredOrders.length,
      orders: filteredOrders,
    });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
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
    const { status, paymentStatus } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    const validPaymentStatuses = ["unpaid", "paid", "refunded"];

    const order = await Order.findById(id).populate({
      path: "products.product",
      model: "Products",
      select: "createdBy name _id",
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (req.user.role === "seller") {
      const ownsProduct = order.products.some(
        (item) =>
          item.product?.createdBy?.toString() === req.user._id.toString()
      );

      if (!ownsProduct) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this order",
        });
      }
    }

    if (status) {
      if (!validStatuses.includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid order status" });
      }
      order.status = status;
    }

    if (paymentStatus) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid payment status" });
      }
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
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

// cancel order authorized user only
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const order = await Order.findById(id);
    console.log(order);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You cannot cancel order",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This order is already cancelled",
      });
    }

    if (order.status === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be cancelled",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// seller stats
export const getSellerStats = async (req, res) => {
  try {
    console.log("useride");
    const sellerId = req.user._id;
    console.log("id", sellerId);
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller",
        stats: {},
      });
    }

    // Get seller products
    const sellerProducts = await Product.find({ createdBy: sellerId })
      .select("_id stock price")
      .lean();

    const productIds = (sellerProducts || [])
      .map((p) => (p._id ? p._id.toString() : null))
      .filter(Boolean);

    const totalProducts = productIds.length;
    const totalStock = (sellerProducts || []).reduce((sum, p) => {
      const stock = Number(p.stock) || 0;
      return sum + stock;
    }, 0);

    // If seller has no products, return
    if (!productIds.length) {
      return res.status(200).json({
        success: true,
        stats: {
          totalProducts: 0,
          totalStock: 0,
          totalOrders: 0,
          totalCustomers: 0,
          statusCounts: {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
          },
          totalSoldItems: 0,
          totalRevenue: 0,
        },
      });
    }

    const orders = await Order.find({
      "products.product": { $in: productIds },
    })
      .populate("user", "_id firstName lastName email")
      .populate("products.product", "_id price name")
      .lean();

    // 3) Filter orders to only keep products belonging to this seller
    const filteredOrders = (orders || [])
      .map((order) => {
        const sellerProductsInOrder = (order.products || []).filter((item) => {
          if (!item.product || !item.product._id) return false;
          return productIds.includes(item.product._id.toString());
        });

        if (!sellerProductsInOrder.length) return null;

        return {
          ...order,
          products: sellerProductsInOrder,
        };
      })
      .filter(Boolean);

    const totalOrders = filteredOrders.length;

    const customerSet = new Set();
    let statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    let totalSoldItems = 0;
    let totalRevenue = 0;

    filteredOrders.forEach((order) => {
      const userId =
        order.user && (order.user._id ? order.user._id.toString() : null);
      if (userId) customerSet.add(userId);

      const st = (order.status || "pending").toString().toLowerCase();
      if (statusCounts.hasOwnProperty(st)) statusCounts[st] += 1;
      else {
        statusCounts.pending += 0;
      }

      (order.products || []).forEach((item) => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.product?.price) || 0;
        totalSoldItems += qty;
        totalRevenue += qty * price;
      });
    });

    const totalCustomers = customerSet.size;

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalStock,
        totalOrders,
        totalCustomers,
        statusCounts,
        totalSoldItems,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("getSellerStats error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to compute seller stats",
      stats: {
        totalProducts: 0,
        totalStock: 0,
        totalOrders: 0,
        totalCustomers: 0,
        statusCounts: {
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
        },
        totalSoldItems: 0,
        totalRevenue: 0,
      },
    });
  }
};
