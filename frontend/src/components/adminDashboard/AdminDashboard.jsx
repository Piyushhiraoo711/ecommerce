import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboard } from "../../slice/adminSlice";
import { 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Award,
  RotateCcw
} from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, error } = useSelector((state) => state.admin);
  
  const totals = dashboard?.totals || {};
  const topUsers = dashboard?.topUsers || [];
  const topProducts = dashboard?.topProducts || [];
  const topSellers = dashboard?.topSellers || [];
  const mostReturnedProducts = dashboard?.mostReturnedProducts || [];
  const revenuePerSeller = dashboard?.revenuePerSeller || [];
  const monthlyRevenue = dashboard?.monthlyRevenue || [];
  const sellerDashboard = dashboard?.sellerDashboard || [];

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  const TableCard = ({ title, children, icon: Icon }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        {Icon && <Icon className="w-5 h-5 text-gray-600" />}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 font-medium">Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your platform's performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Users} 
            label="Total Users" 
            value={totals.totalUsers || 0}
            color="bg-blue-500"
          />
          <StatCard 
            icon={Store} 
            label="Total Sellers" 
            value={totals.totalSellers || 0}
            color="bg-purple-500"
          />
          <StatCard 
            icon={Package} 
            label="Total Products" 
            value={totals.totalProducts || 0}
            color="bg-green-500"
          />
          <StatCard 
            icon={ShoppingCart} 
            label="Total Orders" 
            value={totals.totalOrders || 0}
            color="bg-orange-500"
          />
        </div>

        {/* Monthly Revenue */}
        {monthlyRevenue.length > 0 && (
          <div className="mb-8">
            <TableCard title="Monthly Revenue" icon={TrendingUp}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {monthlyRevenue.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {getMonthName(item.month)} {item.year}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600">
                          ${item.totalRevenue?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.ordersCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Users */}
          {topUsers.length > 0 && (
            <TableCard title="Top Users" icon={Award}>
              <div className="space-y-3">
                {topUsers.map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{user.orders}</p>
                      <p className="text-xs text-gray-500">orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </TableCard>
          )}

          {/* Top Products */}
          {topProducts.length > 0 && (
            <TableCard title="Top Products" icon={Package}>
              <div className="space-y-3">
                {topProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{product.sold}</p>
                      <p className="text-xs text-gray-500">sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </TableCard>
          )}
        </div>

        {/* Top Sellers */}
        {topSellers.length > 0 && (
          <div className="mb-8">
            <TableCard title="Top Sellers" icon={Store}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products Sold</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topSellers.map((seller, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{seller.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{seller.email}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-purple-600">{seller.sold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* Seller Performance */}
        {sellerDashboard.length > 0 && (
          <div className="mb-8">
            <TableCard title="Seller Performance" icon={DollarSign}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sellerDashboard.map((seller, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{seller.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{seller.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{seller.totalProducts}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600">
                          ${seller.totalAmount?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* Revenue Per Seller */}
        {revenuePerSeller.length > 0 && (
          <div className="mb-8">
            <TableCard title="Revenue by Seller" icon={TrendingUp}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {revenuePerSeller.map((seller, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{seller.sellerName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{seller.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{seller.totalOrders}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-600">
                          ${seller.totalRevenue?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableCard>
          </div>
        )}

        {/* Most Returned Products */}
        {mostReturnedProducts.length > 0 && (
          <div className="mb-8">
            <TableCard title="Most Returned Products" icon={RotateCcw}>
              <div className="space-y-3">
                {mostReturnedProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">{product.returns}</p>
                      <p className="text-xs text-gray-500">returns</p>
                    </div>
                  </div>
                ))}
              </div>
            </TableCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;