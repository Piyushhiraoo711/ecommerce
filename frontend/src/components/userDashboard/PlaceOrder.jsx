import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { placeOrder } from "../redux/actions/orderActions";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../slice/productSlice";
import { placeOrder } from "../../slice/orderSlice";

const PlaceOrder = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([{ product: "", quantity: 1 }]);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const { product } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleOrder = async () => {
    console.log({ products, paymentMethod });
    const result = await dispatch(placeOrder({ products, paymentMethod }));
    if (result) {
      toast.success("Order Placed Sucessfully");
      navigate("/")
    } else {
      toast.error("Order failed");
    }
  };

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    setProducts([{ product: product._id, quantity: quantity }]);
  }, [quantity]);

  return (
    <>
      {console.log("product", product)}
      <div className="w-full flex justify-center p-4">
        <div className="max-w-md w-full shadow-lg rounded-lg p-4">
          <div className="m-3 flex justify-center">
            <h1>Place order</h1>
          </div>
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-56 object-cover rounded-md"
          />

          <h2 className="text-xl font-bold mt-3">{product.name}</h2>
          <p className="text-gray-600 text-sm">{product.description}</p>

          <p className="text-lg font-semibold mt-2">₹{product.price}</p>

          <label className="block font-semibold mt-3">Quantity</label>
          <select
            className="border w-full p-2 rounded-md"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          <div className="mt-2">
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          <p className="font-bold mt-4">Total: ₹{product.price * quantity}</p>

          <button
            onClick={handleOrder}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div>
      <h3>Select Payment Method</h3>
      <div>
        <label>
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash on Delivery (COD)
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="Credit Card"
            checked={paymentMethod === "Credit Card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Credit Card
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="UPI"
            checked={paymentMethod === "UPI"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          UPI
        </label>
      </div>
    </div>
  );
};
