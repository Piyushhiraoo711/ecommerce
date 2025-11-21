import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addToCart, getProductById } from "../../slice/productSlice";
import toast from "react-hot-toast";
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Check, Package, Truck, Shield } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { product, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="w-24 h-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">No product found</h2>
        </div>
      </div>
    );
  }

  const totalImages = product.images.length;
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleAddToCart = async (id) => {
    try {
      await dispatch(addToCart({ productId: id, quantity }));
      toast.success("Added to cart");
      navigate("/user/cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Gallery Section */}
            <div className="relative bg-gray-50 p-6 lg:p-10">
              <div className="relative group">
                <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
                  <img
                    src={product.images[currentImage].url}
                    alt={product.name}
                    className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Navigation Arrows */}
                  {totalImages > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>

                      <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                    </>
                  )}

                  {/* Stock Badge */}
                  <div className="absolute top-4 left-4">
                    {product.stock > 0 ? (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        In Stock
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Heart
                      className={`w-6 h-6 transition-colors ${
                        isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>

                {/* Thumbnail Gallery */}
                {totalImages > 1 && (
                  <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
                    {product.images.map((img, index) => (
                      <button
                        key={img._id}
                        onClick={() => setCurrentImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImage
                            ? "border-indigo-600 shadow-md scale-105"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="p-6 lg:p-10 flex flex-col">
              {/* Brand */}
              <div className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">
                {product.brand}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.0) 128 reviews</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{(product.price * 1.3).toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-sm font-semibold">
                    Save 30%
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Product Details */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Stock Available</span>
                  <span className="font-semibold text-gray-900">
                    {product.stock > 0 ? `${product.stock} units` : "Out of stock"}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>
                <select
                  className="w-full border-2 text-gray-700 border-gray-200 p-3 rounded-lg bg-white focus:border-indigo-500 focus:outline-none transition-colors cursor-pointer"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product._id)}
                disabled={product.stock === 0}
                className={`w-full py-4 rounded-xl font-semibold text-white text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] ${
                  product.stock > 0
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Truck className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">Free Shipping</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">2 Year Warranty</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">Easy Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;