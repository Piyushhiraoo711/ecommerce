import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { totalOrders } from "../../slice/adminSlice";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
  DollarSign,
  Calendar,
  User,
  ChevronDown,
  Filter,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { ORDER_API_END_POINT } from "../../utils/constant";

const AllOrders = () => {
  const { totalOrder } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const data = totalOrder?.orders || [];

  useEffect(() => {
    dispatch(totalOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      unpaid: "bg-red-100 text-red-800 border-red-200",
      paid: "bg-green-100 text-green-800 border-green-200",
      refunded: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      console.log(orderId, newStatus);

      const res = await axios.put(
        `${ORDER_API_END_POINT}/update-status`,
        {
          id: orderId,
          status: newStatus,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        dispatch(totalOrders());
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order status");
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      console.log(orderId, newPaymentStatus);

      const res = await axios.put(
        `${ORDER_API_END_POINT}/update-status`,
        {
          id: orderId,
          paymentStatus: newPaymentStatus,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        dispatch(totalOrders());
        toast.success(`Order status updated to ${newPaymentStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order status");
    }
  };

  const filteredOrders = data.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.user.firstName} ${order.user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">
                  {data.length}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Package className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-900">
                  {data.filter((o) => o.status === "pending").length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Delivered</p>
                <p className="text-3xl font-bold text-gray-900">
                  {data.filter((o) => o.status === "delivered").length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  $
                  {data
                    .reduce((sum, o) => sum + o.totalAmount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID, email, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 text-gray-700 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 text-gray-700 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Payment Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-3 border-2  text-gray-700 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Package className="w-24 h-24 mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                getStatusColor={getStatusColor}
                getPaymentStatusColor={getPaymentStatusColor}
                getStatusIcon={getStatusIcon}
                handleUpdateStatus={handleUpdateStatus}
                handleUpdatePaymentStatus={handleUpdatePaymentStatus}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({
  order,
  getStatusColor,
  getPaymentStatusColor,
  getStatusIcon,
  handleUpdateStatus,
  handleUpdatePaymentStatus,
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showPaymentMenu, setShowPaymentMenu] = useState(false);

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const paymentOptions = ["unpaid", "paid"];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        {/* Order Header */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                Order #{order._id.slice(-8)}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {new Date(order.orderDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`px-4 py-2 rounded-lg border-2 font-semibold text-sm flex items-center gap-2 ${getStatusColor(
                  order.status
                )} hover:opacity-80 transition-opacity`}
              >
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showStatusMenu && (
                <div className="absolute right-0 mt-2 w-48 text-gray-700 bg-white rounded-lg shadow-xl border-2 border-gray-100 z-10">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        handleUpdateStatus(order._id, status);
                        setShowStatusMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg capitalize ${
                        order.status === status
                          ? "bg-indigo-50 font-semibold"
                          : ""
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPaymentMenu(!showPaymentMenu)}
                className={`px-4 py-2 rounded-lg border-2 font-semibold text-sm flex items-center gap-2 ${getPaymentStatusColor(
                  order.paymentStatus
                )} hover:opacity-80 transition-opacity`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="capitalize">{order.paymentStatus}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showPaymentMenu && (
                <div className="absolute right-0 mt-2 w-48 text-gray-700 bg-white rounded-lg shadow-xl border-2 border-gray-100 z-10">
                  {paymentOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        handleUpdatePaymentStatus(order._id, status);
                        setShowPaymentMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg capitalize ${
                        order.paymentStatus === status
                          ? "bg-green-50 font-semibold"
                          : ""
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">
              Customer Details
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">Name:</span> {order.user.firstName}{" "}
              {order.user.lastName}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {order.user.email}
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="space-y-3 mb-4">
          {order.products.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
            >
              <img
                src={item.product.images[0]?.url}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-grow">
                <h4 className="font-semibold text-gray-900">
                  {item.product.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {item.product.brand} • {item.product.category}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${item.product.price}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Footer */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CreditCard className="w-4 h-4" />
            <span className="font-medium">{order.paymentMethod}</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-indigo-600">
              ${order.totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
