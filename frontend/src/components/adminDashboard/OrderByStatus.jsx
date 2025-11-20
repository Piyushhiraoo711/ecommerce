import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { totalOrderStatus } from "../../slice/adminSlice";
import { 
  ShoppingCart, 
  Clock, 
  Package,
  Truck,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertCircle,
  Activity
} from "lucide-react";

const OrderByStatus = () => {
  const dispatch = useDispatch();
  const { totalOrderByStatus } = useSelector((state) => state.admin);
  const data = totalOrderByStatus || [];
  
  useEffect(() => {
    dispatch(totalOrderStatus());
  }, [dispatch]);

  const {
    pending = 0,
    processing = 0,
    shipped = 0,
    delivered = 0,
    cancelled = 0,
    totalOrders = 0
  } = data;

  const getPercentage = (count) => {
    return totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) : 0;
  };

  const StatusCard = ({ icon: Icon, label, count, color, bgColor, percentage }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full${bgColor}`}>
          <Icon className={`w-8 h-8${color}`} />
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{count}</p>
          <p className="text-xs text-gray-500">{percentage}%</p>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{label}</h3>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`₹{bgColor.replace('bg-', 'bg-gradient-to-r from-')} h-2 rounded-full transition-all`}
          style={{ width: `₹{percentage}%` }}
        ></div>
      </div>
    </div>
  );

  const orderStatuses = [
    {
      icon: Clock,
      label: "Pending Orders",
      count: pending,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      description: "Orders awaiting confirmation"
    },
    {
      icon: Activity,
      label: "Processing",
      count: processing,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Orders being prepared"
    },
    {
      icon: Truck,
      label: "Shipped",
      count: shipped,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Orders in transit"
    },
    {
      icon: CheckCircle,
      label: "Delivered",
      count: delivered,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Successfully delivered orders"
    },
    {
      icon: XCircle,
      label: "Cancelled",
      count: cancelled,
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: "Cancelled or rejected orders"
    }
  ];

  // Calculate completion metrics
  const activeOrders = pending + processing + shipped;
  const completedOrders = delivered + cancelled;
  const successRate = totalOrders > 0 ? ((delivered / totalOrders) * 100).toFixed(1) : 0;
  const cancellationRate = totalOrders > 0 ? ((cancelled / totalOrders) * 100).toFixed(1) : 0;

  if (totalOrders === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <ShoppingCart className="w-8 h-8" />
              <span>Orders By Status</span>
            </h1>
            <p className="text-gray-600 mt-1">Track order statuses across the platform</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Yet</h3>
            <p className="text-gray-500">Orders will appear here once customers start placing them</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <ShoppingCart className="w-8 h-8 text-blue-500" />
            <span>Orders By Status </span>
          </h1>
          <p className="text-gray-600 mt-1">Real-time overview of order statuses across the platform</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-8 h-8" />
              <p className="text-3xl font-bold">{totalOrders}</p>
            </div>
            <p className="text-blue-100 text-sm font-medium">Total Orders</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8" />
              <p className="text-3xl font-bold">{activeOrders}</p>
            </div>
            <p className="text-orange-100 text-sm font-medium">Active Orders</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8" />
              <p className="text-3xl font-bold">{successRate}%</p>
            </div>
            <p className="text-green-100 text-sm font-medium">Success Rate</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8" />
              <p className="text-3xl font-bold">{completedOrders}</p>
            </div>
            <p className="text-purple-100 text-sm font-medium">Completed</p>
          </div>
        </div>

        {/* Status Cards Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Status Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderStatuses.map((status, index) => (
              <StatusCard
                key={index}
                icon={status.icon}
                label={status.label}
                count={status.count}
                color={status.color}
                bgColor={status.bgColor}
                percentage={getPercentage(status.count)}
              />
            ))}
          </div>
        </div>

        {/* Detailed Status List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Status Details</h2>
          <div className="space-y-4">
            {orderStatuses.map((status, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full${status.bgColor}`}>
                    <status.icon className={`w-6 h-6${status.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{status.label}</h3>
                    <p className="text-sm text-gray-500">{status.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{status.count}</p>
                  <p className="text-sm text-gray-500">{getPercentage(status.count)}% of total</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Delivery Success Rate</span>
                  <span className="font-semibold text-green-600">{successRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                    style={{ width: `₹{successRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Cancellation Rate</span>
                  <span className="font-semibold text-red-600">{cancellationRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full"
                    style={{ width: `₹{cancellationRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Active Order Rate</span>
                  <span className="font-semibold text-blue-600">{getPercentage(activeOrders)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
                    style={{ width: `₹{getPercentage(activeOrders)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Order Insights
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Needs Attention</p>
                <p className="text-2xl font-bold text-yellow-600">{pending + processing}</p>
                <p className="text-xs text-gray-500 mt-1">Orders requiring action</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{processing + shipped}</p>
                <p className="text-xs text-gray-500 mt-1">Orders being fulfilled</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Completed Successfully</p>
                <p className="text-2xl font-bold text-green-600">{delivered}</p>
                <p className="text-xs text-gray-500 mt-1">Happy customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderByStatus;