import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { totalUsers } from "../../slice/adminSlice";
import {
  Users,
  ShoppingCart,
  DollarSign,
  Search,
  Filter,
  Mail,
  User,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

const AllUsers = () => {
  const { totalUser } = useSelector((state) => state.admin);
  const data = totalUser?.data || [];
  const totalUsersCount = totalUser?.totalUsers || 0;
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    dispatch(totalUsers());
  }, [dispatch]);

  const filteredUsers = data.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "all"
        ? true
        : filterType === "active"
        ? user.totalOrders > 0
        : filterType === "inactive"
        ? user.totalOrders === 0
        : true;

    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const activeUsers = data.filter((u) => u.totalOrders > 0).length;
  const totalRevenue = data.reduce((sum, u) => sum + u.totalAmount, 0);
  const totalOrders = data.reduce((sum, u) => sum + u.totalOrders, 0);

  const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  const UserCard = ({ user }) => {
    const isActive = user.totalOrders > 0;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border-l-4 border-l-blue-500">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <div className="flex items-center space-x-1 text-gray-500 text-sm">
                <Mail className="w-3 h-3" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-gray-600 font-medium">Orders</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {user.totalOrders}
            </p>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <p className="text-xs text-gray-600 font-medium">Spent</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ${user.totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Users className="w-8 h-8" />
            <span>All Users</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all registered users
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Users"
            value={totalUsersCount}
            color="bg-blue-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Active Users"
            value={activeUsers}
            subtext={`${((activeUsers / totalUsersCount) * 100 || 0).toFixed(
              0
            )}% of total`}
            color="bg-green-500"
          />
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={totalOrders}
            subtext={`Avg: ${(totalOrders / totalUsersCount || 0).toFixed(
              1
            )} per user`}
            color="bg-purple-500"
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            subtext={`Avg: $${(totalRevenue / totalUsersCount || 0).toFixed(
              0
            )} per user`}
            color="bg-orange-500"
          />
        </div>

        
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

        
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="inactive">Inactive Users</option>
              </select>
            </div>
          </div>

          
          <div className="mt-3 text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredUsers.length}</span> of{" "}
            <span className="font-semibold">{totalUsersCount}</span> users
          </div>
        </div>

    
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Users Found
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No users have been registered yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
