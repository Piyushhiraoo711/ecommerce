import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerOrders } from "../../slice/sellerSlice";
import { 
  ShoppingBag, 
  User, 
  Package, 
  DollarSign, 
  CreditCard, 
  Clock, 
  Mail,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";

const GetOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      processing: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Package },
      shipped: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: TrendingUp },
      delivered: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
    };
    return configs[status?.toLowerCase()] || { color: "bg-gray-100 text-gray-800 border-gray-200", icon: AlertCircle };
  };

  const getPaymentStatusConfig = (status) => {
    return status === "paid" 
      ? { color: "text-green-600", bg: "bg-green-50", icon: CheckCircle }
      : { color: "text-red-600", bg: "bg-red-50", icon: XCircle };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-600">Your orders will appear here once customers place them</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                Orders
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your customer orders • {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </p>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const paymentConfig = getPaymentStatusConfig(order.paymentStatus);
            const StatusIcon = statusConfig.icon;
            const PaymentIcon = paymentConfig.icon;

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Header with Status Badge */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-white" />
                        <span className="text-white/90 text-sm font-medium">Order ID</span>
                      </div>
                      <div className={`${statusConfig.color} px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {order.status.toUpperCase()}
                      </div>
                    </div>
                    <p className="text-white font-mono text-sm">{order._id}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  {/* Customer Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {order.user.firstName} {order.user.lastName}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-500">{order.user.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-4 h-4 text-gray-600" />
                      <p className="font-semibold text-gray-900">Products</p>
                    </div>
                    <div className="space-y-2">
                      {order.products.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-start bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {item.product.name}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </span>
                              {item.returnStatus && item.returnStatus !== "none" && (
                                <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                  Return: {item.returnStatus.toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900">
                           ${item.product.price.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-700">Total Amount</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                       ${order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`${paymentConfig.bg} rounded-lg p-3 border border-gray-100`}>
                      <div className="flex items-center gap-2 mb-1">
                        <PaymentIcon className={`w-4 h-4 ${paymentConfig.color}`} />
                        <p className="text-xs text-gray-600 font-medium">Payment</p>
                      </div>
                      <p className={`font-semibold text-sm ${paymentConfig.color}`}>
                        {order.paymentStatus.toUpperCase()}
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <p className="text-xs text-gray-600 font-medium">Method</p>
                      </div>
                      <p className="font-semibold text-sm text-blue-600">
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  {/* Order Date */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GetOrders;