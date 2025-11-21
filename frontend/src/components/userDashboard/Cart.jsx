import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getMyCart, removeItem } from "../../slice/productSlice";
import { placeOrder } from "../../slice/orderSlice";
import toast from "react-hot-toast";
import { Trash2, ShoppingCart, X } from "lucide-react";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.product);

  const items = cart?.items || [];

  const [paymentMethod, setPaymentMethod] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderingItemId, setOrderingItemId] = useState(null);

  useEffect(() => {
    dispatch(getMyCart());
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading cart...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );

  if (cart === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <ShoppingCart size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Add items to your cart to get started
        </p>
      </div>
    );
  }

  const calculateTotal = (data = items) => {
    return data
      .reduce((sum, item) => {
        return sum + parseFloat(item.product.price) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear the entire cart?")) {
      dispatch(clearCart());
      toast.success("Cart cleared");
    }
  };

  // FIXED: NOW ACCEPTS itemId
  const handlePlaceOrder = (itemId = null) => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    let products = [];

    if (itemId) {
      const item = items.find((i) => i._id === itemId);
      if (!item) {
        toast.error("Item not found");
        return;
      }

      products = [
        {
          product: item.product._id,
          quantity: item.quantity,
        },
      ];
    } else {
      products = items.map((i) => ({
        product: i.product._id,
        quantity: i.quantity,
      }));
    }

    dispatch(placeOrder({ products, paymentMethod }))
      .unwrap()
      .then(() => {
        toast.success("Order placed successfully!");

        // ✅ REMOVE SINGLE ITEM FROM CART
        if (itemId) {
          dispatch(removeItem(itemId));
        }
        // ✅ CLEAR CART IF FULL ORDER
        else {
          dispatch(clearCart());
        }

        setShowCheckout(false);
        setOrderingItemId(null);
        setPaymentMethod("");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const openSingleItemCheckout = (item) => {
    setOrderingItemId(item._id);
    setShowCheckout(true);
  };

  const cartTotal = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="border-b last:border-b-0 p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Brand: {item.product.brand}
                      </p>
                      <p className="text-sm text-gray-600">
                        Category: {item.product.category}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openSingleItemCheckout(item)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between text-gray-800">
                    <p>Price:${parseFloat(item.product.price).toFixed(2)}</p>
                    <p>Qty: {item.quantity}</p>
                    <p className="font-semibold text-blue-600">
                      $
                      {(parseFloat(item.product.price) * item.quantity).toFixed(
                        2
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleClearCart}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <X size={18} /> Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 text-gray-800 pb-6 border-b">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(cartTotal * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  $
                  {(
                    parseFloat(cartTotal) +
                    parseFloat(cartTotal) * 0.1
                  ).toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => {
                  setOrderingItemId(null); // FULL CART
                  setShowCheckout(true);
                }}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>

        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {orderingItemId ? "Order This Item" : "Checkout"}
                </h2>
                <button
                  onClick={() => {
                    setShowCheckout(false);
                    setOrderingItemId(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6 text-gray-800">
                <h3 className="text-lg font-semibold mb-4">
                  Select Payment Method
                </h3>

                {["UPI", "Credit Card", "COD"].map((method) => (
                  <label key={method} className="flex items-center gap-2 py-2">
                    <input
                      type="radio"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    {method}
                  </label>
                ))}
              </div>

              <button
                onClick={() => handlePlaceOrder(orderingItemId)}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Place Order
              </button>

              <button
                onClick={() => {
                  setShowCheckout(false);
                  setOrderingItemId(null);
                }}
                className="w-full mt-3 px-4 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
