import React, { useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { cancelOrder, myOrder } from "../../slice/orderSlice";
import toast from "react-hot-toast";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { myOrders } = useSelector((state) => state.order);
  useEffect(() => {
    dispatch(myOrder());
  }, [dispatch]);

  const handleCancelOrder = async(orderId) => {
    console.log("Cancel order:", orderId);
   try {
    const result = await dispatch(cancelOrder(orderId)).unwrap();
    toast.success(result.message || "Order cancelled successfully");
  } catch (error) {
    toast.error(error || "Failed to cancel order");
  }
  };

  return (
    <>
      {console.log("MyOrders", myOrders)}
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {myOrders?.length === 0 && (
          <p className="text-gray-500 text-center mt-10 text-lg">
            You have not placed any orders yet.
          </p>
        )}

        <div className="space-y-6">
          {myOrders?.map((order) => (
            <div
              key={order._id}
              className="shadow-md rounded-lg p-5 border border-gray-200 "
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">
                  Order ID:{" "}
                  <span className="text-blue-600">#{order._id}</span>
                </h2>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "shipped"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>

              {order.products.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row md:items-center justify-between border-b pb-3 mb-3"
                >
                  <div>
                    <p className="font-semibold text-gray-100">
                      {item.product.name}
                    </p>
                    <p className="text-gray-200 text-sm">
                      {item.product.category}
                    </p>

                    <p className="mt-1">
                      Price:{" "}
                      <span className="font-semibold">
                        ₹{item.product.price}
                      </span>
                    </p>
                    <p>
                      Quantity:{" "}
                      <span className="font-semibold">{item.quantity}</span>
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex flex-col md:flex-row justify-between mt-3">
                <div>
                  <p>
                    Total Paid:{" "}
                    <span className="font-bold text-lg">
                      ₹{order.totalAmount}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed on: {moment(order.orderDate).format("DD MMM YYYY")}
                  </p>
                </div>

                <div className="mt-3 md:mt-0">
                  <p className="text-sm">
                    Payment:{" "}
                    <span
                      className={`font-semibold ${
                        order.paymentStatus === "unpaid"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-sm">
                    Method:{" "}
                    <span className="font-semibold">{order.paymentMethod}</span>
                  </p>
                </div>
              </div>

              {["pending", "processing", "shipped"].includes(order.status) && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyOrders;
