import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { cancelOrder, myOrder } from "../../slice/orderSlice";
import toast from "react-hot-toast";
import { ShoppingBag, Clock, Truck, CheckCircle, XCircle, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { myOrders, loading } = useSelector((state) => state.order);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    dispatch(myOrder());
  }, [dispatch]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setCancellingId(orderId);
      try {
        const result = await dispatch(cancelOrder(orderId)).unwrap();
        toast.success(result.message || "Order cancelled successfully");
      } catch (error) {
        toast.error(error || "Failed to cancel order");
      } finally {
        setCancellingId(null);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="text-yellow-500" size={20} />;
      case "processing":
        return <AlertCircle className="text-blue-500" size={20} />;
      case "shipped":
        return <Truck className="text-blue-500" size={20} />;
      case "delivered":
        return <CheckCircle className="text-green-500" size={20} />;
      case "cancelled":
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <ShoppingBag className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 border-yellow-200";
      case "processing":
        return "bg-blue-50 border-blue-200";
      case "shipped":
        return "bg-indigo-50 border-indigo-200";
      case "delivered":
        return "bg-green-50 border-green-200";
      case "cancelled":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === "paid" ? "text-green-600" : "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <ShoppingBag size={40} className="text-blue-600" />
          </div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag size={32} className="text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              My Orders
            </h1>
          </div>
          <p className="text-gray-600">
            {myOrders?.length === 0
              ? "Start shopping to place your first order"
              : `You have${myOrders?.length} order${myOrders?.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Empty State */}
        {myOrders?.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders. Start shopping now!
            </p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {myOrders?.map((order) => (
            <div
              key={order._id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition border-2 overflow-hidden${getStatusColor(
                order.status
              )}`}
            >
              {/* Order Header */}
              <div className="p-5 md:p-6 cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Status Icon */}
                    <div className="mt-1">{getStatusIcon(order.status)}</div>

                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                        <h2 className="font-semibold text-lg text-gray-900">
                          Order <span className="text-blue-600">#{order._id.slice(-8)}</span>
                        </h2>
                        <span
                          className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap${getStatusBadgeColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        Placed on {moment(order.orderDate).format("DD MMM YYYY, hh:mm A")}
                      </p>

                      {/* Product Summary */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">{order.products.length}</span> item{order.products.length !== 1 ? "s" : ""} • Total:{" "}
                          <span className="font-bold text-lg text-gray-900">
                           ${order.totalAmount}
                          </span>
                        </p>
                      </div>

                      {/* Payment & Method */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Payment Method</p>
                          <p className="font-semibold text-gray-900">
                            {order.paymentMethod}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment Status</p>
                          <p
                            className={`font-semibold${getPaymentStatusColor(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentStatus.charAt(0).toUpperCase() +
                              order.paymentStatus.slice(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div className="text-gray-400 mt-1">
                    {expandedOrder === order._id ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedOrder === order._id && (
                <div className="border-t border-gray-200 px-5 md:px-6 py-6 bg-gray-50">
                  {/* Products */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Order Items
                    </h3>
                    <div className="space-y-4">
                      {order.products.map((item) => (
                        <div
                          key={item._id}
                          className="bg-white rounded-lg p-4 border border-gray-200 flex justify-between items-start"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Category: {item.product.category}
                            </p>
                            <div className="flex gap-6 mt-3 text-sm">
                              <div>
                                <p className="text-gray-600">Price</p>
                                <p className="font-semibold text-gray-900">
                                 ${item.product.price}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Quantity</p>
                                <p className="font-semibold text-gray-900">
                                  {item.quantity}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Subtotal</p>
                                <p className="font-semibold text-blue-600">
                                 ${item.product.price * item.quantity}
                                </p>
                              </div>
                            </div>
                            {item.returnStatus && item.returnStatus !== "none" && (
                              <div className="mt-3 text-xs">
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                  Return Status: {item.returnStatus}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">
                       ${order.totalAmount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-3">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-blue-600">
                       ${order.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  {["pending", "processing", "shipped"].includes(
                    order.status
                  ) && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingId === order._id}
                      className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
                    >
                      {cancellingId === order._id
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;