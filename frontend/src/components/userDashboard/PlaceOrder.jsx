import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../slice/productSlice";
import { placeOrder } from "../../slice/orderSlice";
import { ShoppingBag, CreditCard, Wallet, Banknote, Package, CheckCircle, ChevronRight } from "lucide-react";

const PlaceOrder = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [quantity, setQuantity] = useState(1);

  const { product, loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product._id) {
      setProducts([{ product: product._id, quantity }]);
    }
  }, [product, quantity]);

  const handleOrder = async () => {
    if (!products.length || !products[0].product) {
      toast.error("Product not loaded. Please wait.");
      return;
    }

    const result = await dispatch(placeOrder({ products, paymentMethod }));

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Order Placed Successfully");
      navigate("/user/home");
    } else {
      toast.error(result.payload || "Order failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  const subtotal = product.price * quantity;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
          <p className="text-gray-600">Review your order and select payment method</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Details Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Details
                </h2>
              </div>
              
              <div className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={product?.images[0]?.url}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-xl shadow-md"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-indigo-600">${product.price}</span>
                      <span className="text-sm text-gray-500">per item</span>
                    </div>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                      <select
                        className="border-2 text-gray-700 border-gray-200 px-4 py-2 rounded-lg bg-white focus:border-indigo-500 focus:outline-none transition-colors cursor-pointer font-medium"
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
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>
              </div>
              
              <div className="p-6">
                <PaymentMethodSelector
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
              </div>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (5%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t-2 border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Banner */}
                {shipping === 0 && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-700 font-medium">
                      You've qualified for free shipping!
                    </p>
                  </div>
                )}

                {/* Place Order Button */}
                <button
                  onClick={handleOrder}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <span>Place Order</span>
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Security Note */}
                <p className="text-xs text-center text-gray-500 mt-4">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }) => {
  const paymentOptions = [
    {
      value: "COD",
      label: "Cash on Delivery",
      icon: Banknote,
      description: "Pay when you receive your order"
    },
    {
      value: "Credit Card",
      label: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, Amex accepted"
    },
    {
      value: "UPI",
      label: "UPI Payment",
      icon: Wallet,
      description: "PhonePe, GPay, Paytm, etc."
    }
  ];

  return (
    <div className="space-y-3">
      {paymentOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = paymentMethod === option.value;
        
        return (
          <label
            key={option.value}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              isSelected
                ? "border-indigo-600 bg-indigo-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              value={option.value}
              checked={isSelected}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 w-5 h-5 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            />
            
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-1">
                <div className={`p-2 rounded-lg ${
                  isSelected ? "bg-indigo-100" : "bg-gray-100"
                }`}>
                  <Icon className={`w-5 h-5 ${
                    isSelected ? "text-indigo-600" : "text-gray-600"
                  }`} />
                </div>
                <span className={`font-semibold ${
                  isSelected ? "text-indigo-900" : "text-gray-900"
                }`}>
                  {option.label}
                </span>
              </div>
              <p className={`text-sm ml-11 ${
                isSelected ? "text-indigo-700" : "text-gray-600"
              }`}>
                {option.description}
              </p>
            </div>
            
            {isSelected && (
              <CheckCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            )}
          </label>
        );
      })}
    </div>
  );
};