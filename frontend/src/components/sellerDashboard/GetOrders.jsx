import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerOrders } from "../../slice/sellerSlice";

const GetOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="shadow-md p-5 rounded-xl border hover:shadow-xl transition duration-300"
              >
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Order ID:</p>
                  <p className="font-semibold">{order._id}</p>
                </div>

                <div className="mt-3">
                  <p className="font-semibold">
                    Buyer: {order.user.firstName} {order.user.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{order.user.email}</p>
                </div>

                <div className="mt-4 border-t pt-3">
                  <p className="font-semibold mb-2">Products:</p>

                  {order.products.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center mb-2"
                    >
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">₹ {item.product.price}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-between items-center border-t pt-3">
                  <p className="text-gray-400 font-medium">Total Amount:</p>
                  <p className="text-xl font-bold text-green-600">
                    ₹ {order.totalAmount}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-sm">
                    Payment:{" "}
                    <span
                      className={`font-semibold ${
                        order.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-sm">
                    PaymentMethod:{" "}
                    <span
                      className={`font-semibold ${
                        order.paymentMethod === "COD"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {order.paymentMethod.toUpperCase()}
                    </span>
                  </p>
                </div>

                <div className="mt-3">
                  <p className="text-sm">
                    Status:{" "}
                    <span className="font-semibold text-blue-600">
                      {order.status.toUpperCase()}
                    </span>
                  </p>
                </div>

                {/* Return Status */}
                <div className="mt-2 text-sm">
                  <p>
                    <span className="font-semibold">Return Status: </span>
                    {order.products.map((item, index) => (
                      <span key={index} className="text-orange-600">
                        {item.returnStatus.toUpperCase()}
                        {index < order.products.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                </div>

                {/* Date */}
                <div className="mt-3 text-xs text-gray-500">
                  Order Date: {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default GetOrders;
