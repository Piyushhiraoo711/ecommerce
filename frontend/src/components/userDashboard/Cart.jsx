import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getMyCart, removeItem } from "../../slice/productSlice";
import toast from "react-hot-toast";
import { placeOrder } from "../../slice/orderSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.product);
  const {
    loading: orderLoading,
    success,
    error: orderError,
  } = useSelector((state) => state.order);

  const items = cart?.items || [];

  const [paymentMethod, setPaymentMethod] = useState("COD");

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
    toast.success("Item remove from cart");
  };

  const handleClear = () => {
    dispatch(clearCart());
    toast.success("Cart clear");
  };

  // full cart item placed
  const handlePlaceCartOrder = () => {
    console.log({ items, paymentMethod });
    dispatch(placeOrder({ items, paymentMethod }));
    toast.success("Order Placed successfully");
    navigate("/my-orders");
  };

  // single cart item placed
  const handlePlaceSingleOrder = (item) => {
    dispatch(placeOrder({ items: [item], paymentMethod }));
    toast.success("Order Placed successfully");
    navigate("/my-orders");
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
                  <div className="flex-1 min-w-[150px]">
                    <h4 className="text-lg font-medium">{item.product.name}</h4>
                    <p className="text-gray-400 text-sm">
                      {item.product.brand}
                    </p>
                  </div>

                  <div className="flex-1 text-center min-w-[120px]">
                    <p className="text-gray-300">
                      Price: ₹{item.product.price}
                    </p>
                    <p className="text-gray-400">Qty: {item.quantity}</p>
                  </div>

                  <div className="flex-1 text-center min-w-[100px] font-semibold">
                    ₹ {(item.product.price * item.quantity).toFixed(2)}
                  </div>

                  <div className="flex flex-col justify-center min-w-[120px] mt-2 sm:mt-0 space-y-2">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleRemove(item._id)}
                    >
                      Remove
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => handlePlaceSingleOrder(item)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Payment Method</h3>
              <div className="flex gap-4">
                {["COD", "Credit Card", "UPI"].map((method) => (
                  <label key={method} className="flex items-center gap-1">
                    <input
                      type="radio"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 border-t font-semibold text-lg">
              <span>Total: ₹ {totalPrice.toFixed(2)}</span>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={handleClear}
                >
                  Clear Cart
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={handlePlaceCartOrder}
                  disabled={orderLoading}
                >
                  {orderLoading ? "Placing..." : "Place Order"}
                </button>
              </div>
            </div>

            {success && (
              <p className="mt-4 text-green-600">Order placed successfully!</p>
            )}
            {orderError && <p className="mt-4 text-red-600">{orderError}</p>}
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
