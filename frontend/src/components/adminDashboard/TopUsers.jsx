import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { topUsers } from "../../slice/adminSlice";
import { 
  Trophy, 
  ShoppingCart, 
  DollarSign, 
  Mail,
  User,
  Crown,
  TrendingUp,
  Award,
  AlertCircle
} from "lucide-react";

const TopUsers = () => {
  const dispatch = useDispatch();
  const { topUser } = useSelector((state) => state.admin);
  const data = topUser?.data || [];
  
  useEffect(() => {
    dispatch(topUsers());
  }, [dispatch]);

  // Calculate statistics
  const totalOrders = data.reduce((sum, user) => sum + user.totalOrders, 0);
  const totalRevenue = data.reduce((sum, user) => sum + user.totalSpent, 0);
  const averageSpent = data.length > 0 ? totalRevenue / data.length : 0;

  const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-4 rounded-full${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  const TopUserCard = ({ user, rank }) => {
    const getRankIcon = (rank) => {
      if (rank === 1) return { icon: Crown, color: "text-yellow-500", bg: "bg-yellow-50" };
      if (rank === 2) return { icon: Award, color: "text-gray-400", bg: "bg-gray-50" };
      if (rank === 3) return { icon: Award, color: "text-orange-600", bg: "bg-orange-50" };
      return { icon: Trophy, color: "text-blue-500", bg: "bg-blue-50" };
    };

    const rankStyle = getRankIcon(rank);
    const RankIcon = rankStyle.icon;

    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12${rankStyle.bg} rounded-full flex items-center justify-center`}>
                <RankIcon className={`w-6 h-6${rankStyle.color}`} />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Rank #{rank}</p>
                <p className="text-white/80 text-xs">Top Customer</p>
              </div>
            </div>
            {rank <= 3 && (
              <div className="text-3xl">
                {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{user.user.name}</h3>
              <div className="flex items-center space-x-1 text-gray-500 text-sm">
                <Mail className="w-3 h-3" />
                <span className="truncate">{user.user.email}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <p className="text-xs text-gray-600 font-medium">Orders</p>
              </div>
              <p className="text-3xl font-bold text-blue-600">{user.totalOrders}</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <p className="text-xs text-gray-600 font-medium">Spent</p>
              </div>
              <p className="text-3xl font-bold text-green-600">
               ${user.totalSpent.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-center text-purple-700">
              <span className="font-semibold">
               ${(user.totalSpent / user.totalOrders).toFixed(2)}
              </span> average per order
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <Trophy className="w-8 h-8" />
              <span>Top Users</span>
            </h1>
            <p className="text-gray-600 mt-1">Our most valuable customers</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Top Users Yet</h3>
            <p className="text-gray-500">Start getting orders to see your top customers here</p>
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
            <Trophy className="w-8 h-8 text-yellow-500" />
            <span>Top Users</span>
          </h1>
          <p className="text-gray-600 mt-1">Our most valuable customers ranked by total spending</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={User}
            label="Top Customers"
            value={data.length}
            color="bg-blue-500"
          />
          <StatCard 
            icon={ShoppingCart}
            label="Total Orders"
            value={totalOrders}
            subtext={`Avg:${(totalOrders / data.length).toFixed(1)} per customer`}
            color="bg-purple-500"
          />
          <StatCard 
            icon={DollarSign}
            label="Combined Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            subtext={`Avg:$${averageSpent.toFixed(0)} per customer`}
            color="bg-green-500"
          />
        </div>

        {/* Leaderboard Header */}
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-t-lg p-6 text-white mb-0">
          <div className="flex items-center justify-center space-x-3">
            <Trophy className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Customer Leaderboard</h2>
            <Trophy className="w-8 h-8" />
          </div>
          <p className="text-center text-white/90 mt-2">
            Celebrating our most loyal customers
          </p>
        </div>

        {/* Top Users Grid */}
        <div className="bg-white rounded-b-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((user, index) => (
              <TopUserCard key={user.user.id} user={user} rank={index + 1} />
            ))}
          </div>
        </div>

        {/* Additional Insights */}
        {data.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Key Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Highest Spender</p>
                <p className="text-xl font-bold text-blue-600">
                  {data[0].user.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                 ${data[0].totalSpent.toLocaleString()} total spent
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Most Active</p>
                <p className="text-xl font-bold text-green-600">
                  {[...data].sort((a, b) => b.totalOrders - a.totalOrders)[0].user.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {[...data].sort((a, b) => b.totalOrders - a.totalOrders)[0].totalOrders} orders placed
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopUsers;