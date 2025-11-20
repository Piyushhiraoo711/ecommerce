import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { totalSellers } from "../../slice/adminSlice";
import { 
  Store, 
  Package, 
  DollarSign, 
  Search,
  Filter,
  Mail,
  TrendingUp,
  AlertCircle,
  ShoppingBag
} from "lucide-react";

const AllSellers = () => {
  const dispatch = useDispatch();
  const { totalSeller } = useSelector((state) => state.admin);
  const data = totalSeller?.data || [];
  const totalSellersCount = totalSeller?.totalSellers || 0;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); 
  const [sortBy, setSortBy] = useState("revenue"); 

  useEffect(() => {
    dispatch(totalSellers());
  }, [dispatch]);

  let filteredSellers = data.filter(seller => {
    const matchesSearch = 
      seller.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterType === "all" ? true :
      filterType === "active" ? seller.totalSoldItems > 0 :
      filterType === "top" ? seller.totalRevenue > 1000 : true;
    
    return matchesSearch && matchesFilter;
  });

  filteredSellers = [...filteredSellers].sort((a, b) => {
    if (sortBy === "revenue") return b.totalRevenue - a.totalRevenue;
    if (sortBy === "products") return b.totalProducts - a.totalProducts;
    if (sortBy === "sales") return b.totalSoldItems - a.totalSoldItems;
    return 0;
  });

  const activeSellers = data.filter(s => s.totalSoldItems > 0).length;
  const totalRevenue = data.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalProducts = data.reduce((sum, s) => sum + s.totalProducts, 0);
  const totalSales = data.reduce((sum, s) => sum + s.totalSoldItems, 0);

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

  const SellerCard = ({ seller }) => {
    const isActive = seller.totalSoldItems > 0;
    const isTopSeller = seller.totalRevenue > 1000;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border-l-4 border-l-purple-500">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {seller.firstName} {seller.lastName}
              </h3>
              <div className="flex items-center space-x-1 text-gray-500 text-sm">
                <Mail className="w-3 h-3" />
                <span>{seller.email}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isActive 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
            {isTopSeller && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                ⭐ Top Seller
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Package className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-gray-600 font-medium">Products</p>
            </div>
            <p className="text-xl font-bold text-blue-600">{seller.totalProducts}</p>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <ShoppingBag className="w-4 h-4 text-purple-600" />
              <p className="text-xs text-gray-600 font-medium">Sold</p>
            </div>
            <p className="text-xl font-bold text-purple-600">{seller.totalSoldItems}</p>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <p className="text-xs text-gray-600 font-medium">Revenue</p>
            </div>
            <p className="text-xl font-bold text-green-600">
              ${seller.totalRevenue.toLocaleString()}
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
            <Store className="w-8 h-8" />
            <span>All Sellers</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage and monitor all registered sellers</p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Store}
            label="Total Sellers"
            value={totalSellersCount}
            color="bg-purple-500"
          />
          <StatCard 
            icon={TrendingUp}
            label="Active Sellers"
            value={activeSellers}
            subtext={`${((activeSellers/totalSellersCount)*100 || 0).toFixed(0)}% of total`}
            color="bg-green-500"
          />
          <StatCard 
            icon={Package}
            label="Total Products"
            value={totalProducts}
            subtext={`Avg: ${(totalProducts/totalSellersCount || 0).toFixed(1)} per seller`}
            color="bg-blue-500"
          />
          <StatCard 
            icon={DollarSign}
            label="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            subtext={`${totalSales} items sold`}
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
                className="w-full pl-10 pr-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
 
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="all">All Sellers</option>
                <option value="active">Active Sellers</option>
                <option value="top">Top Sellers ($1000)</option>
              </select>
            </div>

          
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="revenue">Sort by Revenue</option>
                <option value="products">Sort by Products</option>
                <option value="sales">Sort by Sales</option>
              </select>
            </div>
          </div>
          
          
          <div className="mt-3 text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredSellers.length}</span> of <span className="font-semibold">{totalSellersCount}</span> sellers
          </div>
        </div>

       
        {filteredSellers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSellers.map((seller) => (
              <SellerCard key={seller.sellerId} seller={seller} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Sellers Found</h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "No sellers have been registered yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSellers;