import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { topSellers } from "../../slice/adminSlice";
import { 
  Store, 
  Trophy, 
  DollarSign, 
  Mail,
  ShoppingBag,
  Crown,
  Award,
  TrendingUp,
  AlertCircle,
  Star
} from "lucide-react";

const TopSellers = () => {
  const dispatch = useDispatch();
  const { topSeller } = useSelector((state) => state.admin);
  const data = topSeller?.data || [];
  
  useEffect(() => {
    dispatch(topSellers());
  }, [dispatch]);

  // Calculate statistics
  const totalSold = data.reduce((sum, seller) => sum + seller.totalSold, 0);
  const totalRevenue = data.reduce((sum, seller) => sum + seller.totalRevenue, 0);
  const averageRevenue = data.length > 0 ? totalRevenue / data.length : 0;

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

  const TopSellerCard = ({ seller, rank }) => {
    const getRankIcon = (rank) => {
      if (rank === 1) return { icon: Crown, color: "text-yellow-500", bg: "bg-yellow-50", badge: "🏆 Champion" };
      if (rank === 2) return { icon: Star, color: "text-gray-400", bg: "bg-gray-50", badge: "🥈 Runner-up" };
      if (rank === 3) return { icon: Award, color: "text-orange-600", bg: "bg-orange-50", badge: "🥉 Third Place" };
      return { icon: Trophy, color: "text-purple-500", bg: "bg-purple-50", badge: "⭐ Top Seller" };
    };

    const rankStyle = getRankIcon(rank);
    const RankIcon = rankStyle.icon;

    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12${rankStyle.bg} rounded-full flex items-center justify-center`}>
                <RankIcon className={`w-6 h-6${rankStyle.color}`} />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Rank #{rank}</p>
                <p className="text-white/80 text-xs">{rankStyle.badge}</p>
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
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{seller.seller.name}</h3>
              <div className="flex items-center space-x-1 text-gray-500 text-sm">
                <Mail className="w-3 h-3" />
                <span className="truncate">{seller.seller.email}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
                <p className="text-xs text-gray-600 font-medium">Items Sold</p>
              </div>
              <p className="text-3xl font-bold text-purple-600">{seller.totalSold}</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <p className="text-xs text-gray-600 font-medium">Revenue</p>
              </div>
              <p className="text-3xl font-bold text-green-600">
               ${seller.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-center text-blue-700">
              <span className="font-semibold">
               ${(seller.totalRevenue / seller.totalSold).toFixed(2)}
              </span> average per item
            </p>
          </div>

          {/* Performance Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Performance</span>
              <span>{((seller.totalRevenue / totalRevenue) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all"
                style={{ width: `${(seller.totalRevenue / totalRevenue) * 100}%` }}
              ></div>
            </div>
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
              <Store className="w-8 h-8" />
              <span>Top Sellers</span>
            </h1>
            <p className="text-gray-600 mt-1">Our best performing sellers</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Top Sellers Yet</h3>
            <p className="text-gray-500">Start getting sales to see your top sellers here</p>
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
            <Store className="w-8 h-8 text-purple-500" />
            <span>Top Sellers</span>
          </h1>
          <p className="text-gray-600 mt-1">Our best performing sellers ranked by revenue</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={Store}
            label="Top Sellers"
            value={data.length}
            color="bg-purple-500"
          />
          <StatCard 
            icon={ShoppingBag}
            label="Total Items Sold"
            value={totalSold}
            subtext={`Avg:${(totalSold / data.length).toFixed(1)} per seller`}
            color="bg-blue-500"
          />
          <StatCard 
            icon={DollarSign}
            label="Combined Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            subtext={`Avg:$${averageRevenue.toFixed(0)} per seller`}
            color="bg-green-500"
          />
        </div>

        {/* Leaderboard Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-t-lg p-6 text-white mb-0">
          <div className="flex items-center justify-center space-x-3">
            <Trophy className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Seller Leaderboard</h2>
            <Trophy className="w-8 h-8" />
          </div>
          <p className="text-center text-white/90 mt-2">
            Recognizing our outstanding sales performers
          </p>
        </div>

        {/* Top Sellers Grid */}
        <div className="bg-white rounded-b-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((seller, index) => (
              <TopSellerCard key={seller.seller.id} seller={seller} rank={index + 1} />
            ))}
          </div>
        </div>

        {/* Additional Insights */}
        {data.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Key Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Top Revenue Generator</p>
                <p className="text-xl font-bold text-purple-600">
                  {data[0].seller.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                 ${data[0].totalRevenue.toLocaleString()} in revenue
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Most Items Sold</p>
                <p className="text-xl font-bold text-blue-600">
                  {[...data].sort((a, b) => b.totalSold - a.totalSold)[0].seller.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {[...data].sort((a, b) => b.totalSold - a.totalSold)[0].totalSold} items sold
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Best Price Per Item</p>
                <p className="text-xl font-bold text-green-600">
                  {[...data].sort((a, b) => (b.totalRevenue/b.totalSold) - (a.totalRevenue/a.totalSold))[0].seller.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                 ${([...data].sort((a, b) => (b.totalRevenue/b.totalSold) - (a.totalRevenue/a.totalSold))[0].totalRevenue / [...data].sort((a, b) => (b.totalRevenue/b.totalSold) - (a.totalRevenue/a.totalSold))[0].totalSold).toFixed(2)} avg
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSellers;