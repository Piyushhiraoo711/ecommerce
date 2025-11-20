import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, getProductById } from "../../slice/productSlice";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../customFields/CustomButton";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function AllProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.product);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Image carousel state
  const [imageIndices, setImageIndices] = useState({});

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!products) return [];
    const cats = [...new Set(products.map((p) => p.category))];
    return cats.sort();
  }, [products]);

  // Get price range from products
  const maxPrice = useMemo(() => {
    if (!products || products.length === 0) return 10000;
    return Math.max(...products.map((p) => parseFloat(p.price)));
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const categoryMatch =
        selectedCategory === "all" || product.category === selectedCategory;
      const price = parseFloat(product.price);
      const priceMatch = price >= priceRange[0] && price <= priceRange[1];
      return categoryMatch && priceMatch;
    });
  }, [products, selectedCategory, priceRange]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange]);

  const handleBuyNow = (id) => {
    dispatch(getProductById(id));
    navigate(`/place-order/${id}`);
  };

  const handleAddToCart = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handlePrevImage = (productId) => {
    setImageIndices((prev) => ({
      ...prev,
      [productId]:
        ((prev[productId] || 1) - 1 + (products.find(p => p._id === productId)?.images.length || 1)) %
        (products.find(p => p._id === productId)?.images.length || 1),
    }));
  };

  const handleNextImage = (productId) => {
    const product = products.find((p) => p._id === productId);
    const imageCount = product?.images?.length || 1;
    setImageIndices((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % imageCount,
    }));
  };

  const getProductImage = (product) => {
    const index = imageIndices[product._id] || 0;
    if (product.images && product.images.length > 0) {
      return product.images[index]?.url || "https://via.placeholder.com/300";
    }
    return "https://via.placeholder.com/300";
  };

  const getImageCount = (product) => {
    return product.images?.length || 0;
  };

  return (
    <div className="min-h-screen bg-indigo-500 ">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">All Products</h1>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block bg-gray-800 p-6 rounded-lg h-fit lg:sticky lg:top-4`}
          >
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="hidden lg:block text-lg font-semibold text-white mb-6">
              Filters
            </h2>

            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-white mb-4">
                Category
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded transition">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={selectedCategory === "all"}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-300">All Categories</span>
                </label>
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-2 rounded transition"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300 truncate">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-white mb-4">
                Price Range
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">
                    Min:${priceRange[0]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([
                        parseFloat(e.target.value),
                        priceRange[1],
                      ])
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">
                    Max:${priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        parseFloat(e.target.value),
                      ])
                    }
                    className="w-full"
                  />
                </div>
              </div>
              <button
                onClick={() => setPriceRange([0, maxPrice])}
                className="mt-4 w-full px-3 py-2 bg-gray-700 text-gray-300 text-sm rounded hover:bg-gray-600 transition"
              >
                Reset Price
              </button>
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-400">
              Showing {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {paginatedProducts.map((product) => (
                    <div
                      key={product._id}
                      className="group relative border border-gray-700 p-4 rounded-lg hover:border-blue-500 transition bg-gray-800"
                    >
                      {/* Image Carousel */}
                      <div className="relative min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-700 group-hover:opacity-75 lg:aspect-none lg:h-80">
                        <Link to={`/product/${product._id}`}>
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="h-full w-full object-cover object-center lg:h-full lg:w-full transition"
                          />
                        </Link>

                        {/* Image Navigation */}
                        {getImageCount(product) > 1 && (
                          <>
                            <button
                              onClick={() => handlePrevImage(product._id)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-75 transition z-10"
                            >
                              <ChevronLeft size={20} className="text-white" />
                            </button>
                            <button
                              onClick={() => handleNextImage(product._id)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-1 rounded-full hover:bg-opacity-75 transition z-10"
                            >
                              <ChevronRight size={20} className="text-white" />
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 px-2 py-1 rounded text-xs text-white">
                              {(imageIndices[product._id] || 0) + 1} /{" "}
                              {getImageCount(product)}
                            </div>
                          </>
                        )}

                        {/* Stock Badge */}
                        <div className="absolute top-2 right-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold${
                              product.stock > 0
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="mt-4">
                        <h3 className="text-sm font-semibold text-white truncate">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                          {product.category}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Brand: {product.brand}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-lg font-bold text-green-400">
                         ${parseFloat(product.price).toFixed(2)}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="mt-4 flex gap-2">
                        <CustomButton
                          type="button"
                          onClick={() => handleBuyNow(product._id)}
                          disabled={product.stock === 0}
                          className="flex-1"
                        >
                          Buy Now
                        </CustomButton>
                        <CustomButton
                          type="button"
                          onClick={() => handleAddToCart(product._id)}
                          disabled={product.stock === 0}
                          className="flex-1"
                        >
                          Add to Cart
                        </CustomButton>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-4">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNum = index + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 &&
                            pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-2 rounded-lg transition${
                                currentPage === pageNum
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return (
                            <span key={pageNum} className="text-gray-500">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-xl text-gray-400 mb-4">
                  No products found matching your filters
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange([0, maxPrice]);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}