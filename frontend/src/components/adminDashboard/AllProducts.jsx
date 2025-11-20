import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allProducts } from "../../slice/adminSlice";
import { 
  Package, 
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ImageOff,
  DollarSign,
  Box,
  Tag
} from "lucide-react";

const AllProducts = () => {
  const { allProduct } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const products = allProduct?.product || [];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  const [sortBy, setSortBy] = useState("name"); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(allProducts());
  }, [dispatch]);


  const categories = ["all", ...new Set(products.map(p => p.category))];


  let filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      filterCategory === "all" ? true : product.category === filterCategory;
    
    const matchesStock = 
      filterStock === "all" ? true :
      filterStock === "inStock" ? parseInt(product.stock) > 20 :
      filterStock === "lowStock" ? parseInt(product.stock) > 0 && parseInt(product.stock) <= 20 :
      filterStock === "outOfStock" ? parseInt(product.stock) === 0 : true;
    
    return matchesSearch && matchesCategory && matchesStock;
  });


  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "price") return parseInt(b.price) - parseInt(a.price);
    if (sortBy === "stock") return parseInt(b.stock) - parseInt(a.stock);
    return 0;
  });


  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterStock, sortBy]);

  const getStockStatus = (stock) => {
    const stockNum = parseInt(stock);
    if (stockNum === 0) return { text: "Out of Stock", color: "bg-red-100 text-red-700" };
    if (stockNum <= 20) return { text: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
    return { text: "In Stock", color: "bg-green-100 text-green-700" };
  };

  const ProductCard = ({ product }) => {
    const stockStatus = getStockStatus(product.stock);
    const hasImage = product.images && product.images.length > 0 && product.images[0].url;
    
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden">

        <div className="relative h-48 bg-gray-100">
          {hasImage ? (
            <img 
              src={product.images[0].url} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-16 h-16 text-gray-300" />
            </div>
          )}
          <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>

   
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Category:
              </span>
              <span className="font-medium text-gray-700">{product.category}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1">
                <Box className="w-4 h-4" />
                Brand:
              </span>
              <span className="font-medium text-gray-700">{product.brand}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1">
                <Package className="w-4 h-4" />
                Stock:
              </span>
              <span className="font-medium text-gray-700">{product.stock} units</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{product.price}</span>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-400">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === number
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
   
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Package className="w-8 h-8" />
            <span>All Products</span>
          </h1>
          <p className="text-gray-600 mt-1">Browse and manage all products</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-500 text-sm">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-500 text-sm">In Stock</p>
            <p className="text-2xl font-bold text-green-600">
              {products.filter(p => parseInt(p.stock) > 20).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-500 text-sm">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-600">
              {products.filter(p => parseInt(p.stock) > 0 && parseInt(p.stock) <= 20).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-500 text-sm">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">
              {products.filter(p => parseInt(p.stock) === 0).length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
          
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            
            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Stock Levels</option>
              <option value="inStock">In Stock</option>
              <option value="lowStock">Low Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>

          
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
            </select>
          </div>
          
        
          <div className="mt-3 text-sm text-gray-600">
            Showing <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredProducts.length)}</span> of <span className="font-semibold">{filteredProducts.length}</span> products
          </div>
        </div>

        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
           
            {totalPages > 1 && <Pagination />}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
            <p className="text-gray-500">
              {searchTerm || filterCategory !== "all" || filterStock !== "all"
                ? "Try adjusting your search or filter criteria" 
                : "No products have been added yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;