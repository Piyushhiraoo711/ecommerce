import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProduct } from "../../slice/productSlice";
import {
  Edit2,
  Trash2,
  Package,
  DollarSign,
  Archive,
  AlertCircle,
} from "lucide-react";

const SellerProductsCard = ({ sellerProduct }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  if (!sellerProduct || sellerProduct.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No Products Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start adding products to your inventory
          </p>
        </div>
      </div>
    );
  }

  const handleUpdate = (id) => {
    navigate(`/seller/update-product/${id}`);
  };

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      dispatch(deleteProduct(id));
      navigate("/seller");
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0)
      return {
        text: "Out of Stock",
        color: "bg-red-100 text-red-800 border-red-200",
      };
    if (stock < 10)
      return {
        text: "Low Stock",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    return {
      text: "In Stock",
      color: "bg-green-100 text-green-800 border-green-200",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                Your Products
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your inventory • {sellerProduct.length}{" "}
                {sellerProduct.length === 1 ? "product" : "products"}
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sellerProduct.map((product) => {
            const stockStatus = getStockStatus(product.stock);

            return (
              <div
                key={product._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  {product.images && product.images[0] ? (
                    <>
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <Package className="w-16 h-16 mb-2" />
                      <span className="text-sm font-medium">No Image</span>
                    </div>
                  )}

                  {/* Stock Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`${stockStatus.color} px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm`}
                    >
                      {stockStatus.text}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Price and Stock Info */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-50 p-2 rounded-lg">
                        <DollarSign className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Archive className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Stock</p>
                        <p className="text-lg font-bold text-gray-900">
                          {product.stock}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                    {product.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleUpdate(product._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg ${
                        deleteConfirm === product._id
                          ? "bg-gradient-to-r from-red-600 to-red-700 text-white animate-pulse"
                          : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                      }`}
                    >
                      {deleteConfirm === product._id ? (
                        <>
                          <AlertCircle className="w-4 h-4" />
                          Confirm?
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SellerProductsCard;
