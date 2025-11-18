import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getMyCart, removeItem } from "../../slice/productSlice";
import toast from "react-hot-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.product);
  const items = cart?.items;

  const totalPrice = items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );
  useEffect(() => {
    dispatch(getMyCart());
  }, [dispatch]);

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const handleRemove = (id) => {
    dispatch(removeItem(id));
    toast.success("Item remove from cart")
  };

  const handleClear = () => {
    dispatch(clearCart());
    toast.success("Cart clear")
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-semibold text-center mb-6">My Cart</h2>

        {items.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-wrap justify-between items-center p-4 border shadow rounded-lg"
                >
                  {/* Product Info */}
                  <div className="flex-1 min-w-[150px]">
                    <h4 className="text-lg font-medium">{item.product.name}</h4>
                    <p className="text-gray-500 text-sm">
                      {item.product.brand}
                    </p>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex-1 text-center min-w-[120px]">
                    <p className="text-gray-700">
                      Price: ${item.product.price}
                    </p>
                    <p className="text-gray-700">Qty: {item.quantity}</p>
                  </div>

                  {/* Subtotal */}
                  <div className="flex-1 text-center min-w-[100px] font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>

                  {/* Remove Button */}
                  <div className="flex justify-center min-w-[100px] mt-2 sm:mt-0">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleRemove(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 border-t font-semibold text-lg">
              <span>Total: ${totalPrice.toFixed(2)}</span>
              <button
                className="mt-2 sm:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleClear}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
