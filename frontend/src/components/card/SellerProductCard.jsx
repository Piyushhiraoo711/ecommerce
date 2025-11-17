import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProduct } from "../../slice/productSlice";

const SellerProductsCard = ({ sellerProduct }) => {
  const naviagte = useNavigate();
  const dispatch = useDispatch();

  if (!sellerProduct || sellerProduct.length === 0) {
    return <p className="text-center text-gray-500 mt-6">No products found.</p>;
  }

  const handleUpdate = (id) => {
    naviagte(`/seller/update-product/${id}`);
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));

    naviagte("/seller");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Products</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sellerProduct.map((product) => (
          <div
            key={product._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col justify-between"
          >
            <div>
              <div className="h-48 w-full mb-4 overflow-hidden rounded">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {product.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                Price: <span className="font-medium"> ₹ {product.price}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                Stock: <span className="font-medium">{product.stock}</span>
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {product.description.length > 60
                  ? product.description.substring(0, 60) + "..."
                  : product.description}
              </p>
            </div>

            <div className="mt-4 flex justify-between gap-2">
              <button
                onClick={() => handleUpdate(product._id)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded transition-colors"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerProductsCard;
