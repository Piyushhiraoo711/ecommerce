import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";
import User from "../model/userModel.js";

export const getAdminDashboard = async (req, res) => {
  try {
    // ---------- BASIC COUNTS ----------
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalSellers = await User.countDocuments({ role: "seller" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const users = await User.find({ role: "user" });
    const sellers = await User.find({ role: "seller" });

    const products = await Product.find().populate("createdBy");

    const orders = await Order.find()
      .populate("user")
      .populate({
        path: "products.product",
        model: "Products",
        populate: { path: "createdBy", model: "Users" },
      });

    // SAFETY: Remove any corrupted order objects
    const safeOrders = orders.filter(
      (o) => o && o.products && Array.isArray(o.products)
    );

    // =======================================================
    // 1️⃣ TOP USERS
    // =======================================================
    const userOrdersMap = {};

    safeOrders.forEach((order) => {
      const userId = order?.user?._id?.toString();
      if (!userId) return; // skip corrupted orders

      if (!userOrdersMap[userId]) {
        userOrdersMap[userId] = { user: order.user, orders: 0 };
      }
      userOrdersMap[userId].orders += 1;
    });

    const topUsers = Object.values(userOrdersMap)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)
      .map((item) => ({
        name: `${item.user?.firstName ?? ""}${item.user?.lastName ?? ""}`,
        email: item.user?.email ?? "N/A",
        orders: item.orders,
      }));

    // =======================================================
    // 2️⃣ MOST SOLD PRODUCTS
    // =======================================================
    const productSalesMap = {};

    safeOrders.forEach((order) => {
      order.products.forEach((p) => {
        const prod = p?.product;
        if (!prod?._id) return;

        const prodId = prod._id.toString();
        if (!productSalesMap[prodId]) {
          productSalesMap[prodId] = { product: prod, sold: 0 };
        }
        productSalesMap[prodId].sold += p.quantity || 0;
      });
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)
      .map((item) => ({
        name: item.product?.name ?? "Unknown",
        sold: item.sold,
      }));

    // =======================================================
    // 3️⃣ TOP SELLERS
    // =======================================================
    const sellerSalesMap = {};

    safeOrders.forEach((order) => {
      order.products.forEach((p) => {
        const seller = p?.product?.createdBy;
        if (!seller?._id) return;

        const sellerId = seller._id.toString();
        if (!sellerSalesMap[sellerId]) {
          sellerSalesMap[sellerId] = { seller, sold: 0 };
        }
        sellerSalesMap[sellerId].sold += p.quantity || 0;
      });
    });

    const topSellers = Object.values(sellerSalesMap)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)
      .map((item) => ({
        name: `${item.seller?.firstName ?? ""}${item.seller?.lastName ?? ""}`,
        email: item.seller?.email ?? "N/A",
        sold: item.sold,
      }));

    // =======================================================
    // 4️⃣ MOST RETURNED PRODUCTS
    // =======================================================
    const returnedProductsMap = {};

    safeOrders.forEach((order) => {
      order.products.forEach((p) => {
        if (p.returnStatus === "returned" && p?.product?._id) {
          const id = p.product._id.toString();
          if (!returnedProductsMap[id]) {
            returnedProductsMap[id] = { product: p.product, returns: 0 };
          }
          returnedProductsMap[id].returns += 1;
        }
      });
    });

    const mostReturnedProducts = Object.values(returnedProductsMap)
      .sort((a, b) => b.returns - a.returns)
      .slice(0, 5)
      .map((item) => ({
        name: item.product?.name ?? "Unknown",
        returns: item.returns,
      }));

    // =======================================================
    // 5️⃣ SELLER REVENUE
    // =======================================================
    const sellerRevenueMap = {};

    safeOrders.forEach((order) => {
      order.products.forEach((p) => {
        const seller = p?.product?.createdBy;
        if (!seller?._id) return;

        const sellerId = seller._id.toString();
        const revenue = (p.quantity || 0) * (p.product?.price || 0);

        if (!sellerRevenueMap[sellerId]) {
          sellerRevenueMap[sellerId] = {
            seller,
            totalRevenue: 0,
            totalOrders: 0,
          };
        }

        sellerRevenueMap[sellerId].totalRevenue += revenue;
        sellerRevenueMap[sellerId].totalOrders += 1;
      });
    });

    const revenuePerSeller = Object.values(sellerRevenueMap)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .map((item) => ({
        sellerName: `${item.seller?.firstName ?? ""}${item.seller?.lastName ?? ""}`,
        email: item.seller?.email ?? "N/A",
        totalRevenue: item.totalRevenue,
        totalOrders: item.totalOrders,
      }));

    // =======================================================
    // 6️⃣ MONTHLY REVENUE
    // =======================================================
    const monthlyRevenueMap = {};

    safeOrders.forEach((order) => {
      const orderDate = order?.orderDate;
      if (!orderDate) return;

      const month = orderDate.getMonth() + 1;
      const year = orderDate.getFullYear();
      const key = `${year}-${month}`;

      if (!monthlyRevenueMap[key]) {
        monthlyRevenueMap[key] = { totalRevenue: 0, ordersCount: 0 };
      }

      order.products.forEach((p) => {
        const rev = (p.quantity || 0) * (p.product?.price || 0);
        monthlyRevenueMap[key].totalRevenue += rev;
        monthlyRevenueMap[key].ordersCount += 1;
      });
    });

    const monthlyRevenue = Object.entries(monthlyRevenueMap)
      .sort()
      .map(([key, val]) => {
        const [year, month] = key.split("-").map(Number);
        return { year, month, ...val };
      });

    // =======================================================
    // 7️⃣ SELLER DASHBOARD (SAFE VERSION)
    // =======================================================
    const sellerDashboard = sellers.map((seller) => {
      const sellerId = seller?._id?.toString();
      if (!sellerId) return null;

      const sellerProducts = products.filter(
        (p) => p?.createdBy?._id?.toString() === sellerId
      );

      let totalAmount = 0;

      safeOrders.forEach((order) => {
        order.products.forEach((p) => {
          if (p?.product?.createdBy?._id?.toString() === sellerId) {
            totalAmount += (p.quantity || 0) * (p.product?.price || 0);
          }
        });
      });

      return {
        sellerId,
        name: `${seller.firstName}${seller.lastName}`,
        email: seller.email,
        totalProducts: sellerProducts.length,
        totalAmount,
      };
    }).filter(Boolean);

    // =======================================================

    res.status(200).json({
      success: true,
      data: {
        totals: {
          totalUsers,
          totalSellers,
          totalProducts,
          totalOrders,
        },
        topUsers,
        topProducts,
        topSellers,
        mostReturnedProducts,
        revenuePerSeller,
        monthlyRevenue,
        sellerDashboard,
      },
    });

  } catch (error) {
    console.error("💥 ADMIN DASHBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// delete user and seller
export const deleteUser = async (req, res) => {
  try {
    const isAdmin = req.user;
    const userIdToDelete = req.params.id;

    const userToDelete = await User.findById(userIdToDelete);
    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (isAdmin._id.toString() === userIdToDelete && isAdmin.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin cannot delete itself",
      });
    }

    if (userToDelete.role === "user") {
      await Order.deleteMany({ user: userToDelete._id });
    }

    if (userToDelete.role === "seller") {
      // Find all seller products
      const sellerProducts = await Product.find({
        createdBy: userToDelete._id,
      });
      const productIds = sellerProducts.map((p) => p._id);

      // Delete seller’s products
      await Product.deleteMany({ createdBy: userToDelete._id });

      // Cancel all orders containing those products
      await Order.updateMany(
        { "items.product": {$in: productIds } },
        {$set: { status: "cancelled" } }
      );
    }
    await User.findByIdAndDelete(userIdToDelete);

    res.json({
      success: true,
      message: `${userToDelete.role} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// order added last week
// customer added last week
//-------------admin
// total revenue

// top users
export const topUsers = async (req, res) => {
  try {
    const orders = await Order.find().populate("user");
    const userMap = {};

    orders.forEach((order) => {
      if (!order.user) return;

      const userId = order.user._id.toString();

      if (!userMap[userId]) {
        console.log("step 1", userMap[userId]);
        userMap[userId] = {
          user: {
            id: order.user._id,
            name: `${order.user.firstName}${order.user.lastName}`,
            email: order.user.email,
          },
          totalOrders: 0,
          totalSpent: 0,
        };
      }

      userMap[userId].totalOrders += 1;
      userMap[userId].totalSpent += order.totalAmount;
    });

    const topUsers = Object.values(userMap)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      message: "Top users fetched successfully",
      data: topUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// total users
export const totalUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });

    const orders = await Order.find().populate("user");

    const userTotal = users.map((user) => {
      const userOrders = orders.filter(
        (o) => o.user && o.user._id.toString() === user._id.toString()
      );

      const totalOrders = userOrders.length;
      const totalAmount = userOrders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );

      return {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        totalOrders,
        totalAmount,
      };
    });

    res.status(200).json({
      success: true,
      message: "Total users with order details fetched successfully",
      totalUsers: users.length,
      data: userTotal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// top sellers
export const topSellers = async (req, res) => {
  try {
    const orders = await Order.find().populate({
      path: "products.product",
      model: "Products",
      populate: { path: "createdBy", model: "Users" },
    });
    const sellerSalesMap = {};

    orders.forEach((order) => {
      order.products.forEach((p) => {
        if (!p.product || !p.product.createdBy) return;

        const seller = p.product.createdBy;
        const sellerId = seller._id.toString();
        const revenue = p.quantity * p.product.price;

        console.log("step 1", sellerSalesMap[sellerId]);
        if (!sellerSalesMap[sellerId]) {
          sellerSalesMap[sellerId] = {
            seller: {
              id: seller._id,
              name: `${seller.firstName}${seller.lastName}`,
              email: seller.email,
            },
            totalSold: 0,
            totalRevenue: 0,
          };
        }
        sellerSalesMap[sellerId].totalSold += p.quantity;
        sellerSalesMap[sellerId].totalRevenue += revenue;
        console.log("step 2", sellerSalesMap[sellerId].totalSold);
      });
    });

    const topSellers = Object.values(sellerSalesMap)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);
    console.log(topSellers);

    res.status(200).json({
      success: true,
      message: "Top sellers fetched successfully",
      data: topSellers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// total sellers
export const totalSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" });

    const products = await Product.find().populate("createdBy");

    const orders = await Order.find()
      .populate({
        path: "products.product",
        model: "Products",
        populate: { path: "createdBy", model: "Users" },
      })
      .populate("user");

    const sellerTotal = sellers.map((seller) => {
      const sellerProducts = products.filter(
        (p) =>
          p.createdBy && p.createdBy._id.toString() === seller._id.toString()
      );
      const totalProducts = sellerProducts.length;

      let totalRevenue = 0;
      let totalSoldItems = 0;
      orders.forEach((order) => {
        order.products.forEach((p) => {
          if (
            p.product &&
            p.product.createdBy &&
            p.product.createdBy._id.toString() === seller._id.toString()
          ) {
            totalRevenue += p.quantity * p.product.price;
            totalSoldItems += p.quantity;
          }
        });
      });

      return {
        sellerId: seller._id,
        firstName: seller.firstName,
        lastName: seller.lastName,
        email: seller.email,
        totalProducts,
        totalSoldItems,
        totalRevenue,
      };
    });

    res.status(200).json({
      success: true,
      message: "total sellers fetched successfully",
      totalSellers: sellers.length,
      data: sellerTotal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// top products
export const topProducts = async (req, res) => {
  try {
    const orders = await Order.find().populate({
      path: "products.product",
      model: "Products",
    });

    const productSalesMap = {};

    orders.forEach((order) => {
      order.products.forEach((p) => {
        if (!p.product) return;

        const prodId = p.product._id.toString();
        if (!productSalesMap[prodId]) {
          productSalesMap[prodId] = {
            product: p.product,
            totalSold: 0,
            totalRevenue: 0,
          };
        }

        productSalesMap[prodId].totalSold += p.quantity;
        productSalesMap[prodId].totalRevenue += p.quantity * p.product.price;
      });
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5)
      .map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        totalSold: item.totalSold,
        totalRevenue: item.totalRevenue,
      }));

    res.status(200).json({
      success: true,
      message: "Top products fetched successfully",
      data: topProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// total order
export const totalOrdersByStatus = async (req, res) => {
  try {
    const orders = await Order.find();

    const statusCount = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalOrders: orders.length,
    };

    orders.forEach((order) => {
      const status = order.status || "pending";
      if (statusCount.hasOwnProperty(status)) {
        statusCount[status] += 1;
      }
    });

    res.status(200).json({
      success: true,
      message: "Total orders by status fetched successfully",
      data: statusCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
