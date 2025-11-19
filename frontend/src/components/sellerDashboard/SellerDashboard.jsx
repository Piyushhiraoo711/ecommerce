import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerStats } from "../../slice/sellerSlice";
import { Package, TrendingUp, ShoppingCart, Users, ShoppingBag, DollarSign } from "lucide-react";

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((s) => s.seller);

  useEffect(() => {
    dispatch(fetchSellerStats());
  }, [dispatch]);

  const mainStats = [
    { 
      label: 'Total Products', 
      value: stats?.totalProducts || 0, 
      icon: Package,
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      label: 'Total Stock', 
      value: stats?.totalStock || 0, 
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    { 
      label: 'Total Orders', 
      value: stats?.totalOrders || 0, 
      icon: ShoppingCart,
      gradient: 'from-orange-500 to-orange-600',
      lightBg: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    { 
      label: 'Total Customers', 
      value: stats?.totalCustomers || 0, 
      icon: Users,
      gradient: 'from-pink-500 to-pink-600',
      lightBg: 'bg-pink-50',
      iconColor: 'text-pink-600'
    },
    { 
      label: 'Items Sold', 
      value: stats?.totalSoldItems || 0, 
      icon: ShoppingBag,
      gradient: 'from-teal-500 to-teal-600',
      lightBg: 'bg-teal-50',
      iconColor: 'text-teal-600'
    },
    { 
      label: 'Revenue', 
      value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, 
      icon: DollarSign,
      gradient: 'from-green-500 to-green-600',
      lightBg: 'bg-green-50',
      iconColor: 'text-green-600',
      highlight: true
    }
  ];

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    processing: { color: 'bg-blue-100 text-blue-800 border-blue-200' },
    shipped: { color: 'bg-purple-100 text-purple-800 border-purple-200' },
    delivered: { color: 'bg-green-100 text-green-800 border-green-200' },
    cancelled: { color: 'bg-red-100 text-red-800 border-red-200' }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Your business metrics at a glance</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {mainStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                      {stat.label}
                    </p>
                    <p className={`text-3xl sm:text-4xl font-bold ${stat.highlight ? 'text-green-600' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                  </div>
                  
                  <div className={`${stat.lightBg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Status Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Order Status</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full ml-6 max-w-xs"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.statusCounts && Object.entries(stats.statusCounts).map(([status, count]) => (
              <div
                key={status}
                className={`${statusConfig[status]?.color || 'bg-gray-100 text-gray-800 border-gray-200'} 
                  rounded-xl p-5 text-center border-2 hover:scale-105 transition-transform duration-200 cursor-pointer`}
              >
                <p className="text-sm font-semibold uppercase tracking-wide mb-2 opacity-80">
                  {status}
                </p>
                <p className="text-3xl font-bold">
                  {count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;