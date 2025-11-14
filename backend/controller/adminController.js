import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";
import User from "../model/userModel.js";

export const getAdminDashboard = async (req, res) => {
  try {
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

    /// top users
    // const userOrdersMap = {};

    // orders.forEach((order) => {
    //   const userId = order.user._id.toString();
    //   if (!userOrdersMap[userId]) {
    //     userOrdersMap[userId] = { user: order.user, orders: 0 };
    //   }
    //   userOrdersMap[userId].orders += 1;
    // });

    // const topUsers = Object.values(userOrdersMap)
    //   .sort((a, b) => b.orders - a.orders)
    //   .slice(0, 5)
    //   .map((item) => ({
    //     name: `${item.user.firstName} ${item.user.lastName}`,
    //     email: item.user.email,
    //     orders: item.orders,
    //   }));

    // most sold
    const productSalesMap = {};
    orders.forEach((order) => {
      order.products.forEach((p) => {
        const prodId = p.product._id.toString();
        if (!productSalesMap[prodId]) {
          productSalesMap[prodId] = { product: p.product, sold: 0 };
        }
        productSalesMap[prodId].sold += p.quantity;
      });
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)
      .map((item) => ({
        name: item.product.name,
        sold: item.sold,
      }));

    // top seller
    const sellerSalesMap = {};
    orders.forEach((order) => {
      order.products.forEach((p) => {
        const sellerId = p.product.createdBy._id.toString();
        if (!sellerSalesMap[sellerId]) {
          sellerSalesMap[sellerId] = {
            seller: p.product.createdBy,
            sold: 0,
          };
        }
        sellerSalesMap[sellerId].sold += p.quantity;
      });
    });

    const topSellers = Object.values(sellerSalesMap)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5)
      .map((item) => ({
        name: `${item.seller.firstName} ${item.seller.lastName}`,
        email: item.seller.email,
        sold: item.sold,
      }));

    // most return proudct
    const returnedProductsMap = {};
    orders.forEach((order) => {
      order.products.forEach((p) => {
        if (p.returnStatus === "returned") {
          const prodId = p.product._id.toString();
          if (!returnedProductsMap[prodId]) {
            returnedProductsMap[prodId] = { product: p.product, returns: 0 };
          }
          returnedProductsMap[prodId].returns += 1;
        }
      });
    });

    const mostReturnedProducts = Object.values(returnedProductsMap)
      .sort((a, b) => b.returns - a.returns)
      .slice(0, 5)
      .map((item) => ({
        name: item.product.name,
        returns: item.returns,
      }));

    // seller revenue
    const sellerRevenueMap = {};
    orders.forEach((order) => {
      order.products.forEach((p) => {
        const sellerId = p.product.createdBy._id.toString();
        const revenue = p.quantity * p.product.price;

        if (!sellerRevenueMap[sellerId]) {
          sellerRevenueMap[sellerId] = {
            seller: p.product.createdBy,
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
        sellerName: `${item.seller.firstName} ${item.seller.lastName}`,
        email: item.seller.email,
        totalRevenue: item.totalRevenue,
        totalOrders: item.totalOrders,
      }));

    // monthly revenue
    const monthlyRevenueMap = {};
    orders.forEach((order) => {
      if (order.status === "cancelled") return;
      const orderMonth = order.orderDate.getMonth() + 1;
      const orderYear = order.orderDate.getFullYear();
      const key = `${orderYear}-${orderMonth}`;

      if (!monthlyRevenueMap[key]) {
        monthlyRevenueMap[key] = { totalRevenue: 0, ordersCount: 0 };
      }

      order.products.forEach((p) => {
        const revenue = p.quantity * p.product.price;
        monthlyRevenueMap[key].totalRevenue += revenue;
        monthlyRevenueMap[key].ordersCount += 1;
      });
    });

    const monthlyRevenue = Object.keys(monthlyRevenueMap)
      .sort()
      .map((key) => {
        const [year, month] = key.split("-").map(Number);
        return {
          year,
          month,
          totalRevenue: monthlyRevenueMap[key].totalRevenue,
          ordersCount: monthlyRevenueMap[key].ordersCount,
        };
      });

    // Users perticuler
    // const userDashboard = users.map((user) => {
    //   const userOrders = orders.filter(
    //     (o) => o.user._id.toString() === user._id.toString()
    //   );
    //   const totalOrders = userOrders.length;
    //   const totalAmount = userOrders.reduce(
    //     (sum, order) => sum + order.totalAmount,
    //     0
    //   );

    //   return {
    //     userId: user._id,
    //     name: `${user.firstName} ${user.lastName}`,
    //     email: user.email,
    //     totalOrders,
    //     totalAmount,
    //   };
    // });

    // Sellers
    const sellerDashboard = sellers.map((seller) => {
      const sellerProducts = products.filter(
        (p) => p.createdBy._id.toString() === seller._id.toString()
      );
      const totalProducts = sellerProducts.length;

      let totalAmount = 0;
      orders.forEach((order) => {
        order.products.forEach((p) => {
          if (p.product.createdBy._id.toString() === seller._id.toString()) {
            totalAmount += p.quantity * p.product.price;
          }
        });
      });

      return {
        sellerId: seller._id,
        name: `${seller.firstName} ${seller.lastName}`,
        email: seller.email,
        totalProducts,
        totalAmount,
      };
    });

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
        // userDashboard,
        sellerDashboard,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
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
        { "items.product": { $in: productIds } },
        { $set: { status: "cancelled" } }
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
            name: `${order.user.firstName} ${order.user.lastName}`,
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
              name: `${seller.firstName} ${seller.lastName}`,
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
