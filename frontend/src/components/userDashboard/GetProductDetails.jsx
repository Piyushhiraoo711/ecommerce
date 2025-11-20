import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addToCart, getProductById } from "../../slice/productSlice";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { product, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  if (!product) {
    return <div>No product found.</div>;
  }

  const totalImages = product.images.length;
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleAddToCart = async(id) => {
   try {
     await dispatch(addToCart({productId: id, quantity}))
     toast.success("Added to cart");
     navigate("/user/cart");
   } catch (error) {
    toast.error("Failed to add to cart");
   }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="relative w-full">
        <img
          src={product.images[currentImage].url}
          alt={product.name}
          className="w-full h-[400px] sm:h-[500px] md:h-[600px] object-cover rounded-lg"
        />

        <button
          onClick={prevImage}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
        >
          &#8592;
        </button>

        <button
          onClick={nextImage}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
        >
          &#8594;
        </button>

        <div className="flex gap-2 mt-4 justify-center">
          {product.images.map((img, index) => (
            <img
              key={img._id}
              src={img.url}
              alt={product.name}
              className={`w-16 h-16 object-cover rounded cursor-pointer border${
                index === currentImage ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold text-indigo-600">
         ${product.price}
        </p>
        <p className="text-gray-700">{product.description}</p>

        <div className="flex gap-4 flex-wrap text-sm">
          <p>
            <span className="font-semibold">Brand:</span> {product.brand}
          </p>
          <p>
            <span className="font-semibold">Category:</span> {product.category}
          </p>
          <p>
            <span className="font-semibold">Stock Available:</span>{" "}
            {product.stock > 0 ? product.stock : "Out of stock"}
          </p>
        </div>

        <div>
          <label className="block font-semibold mt-3">Quantity</label>
          <select
            className="border w-full p-2 rounded-md bg-gray-600"
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

        <button
        onClick={()=> handleAddToCart(product._id)}
          disabled={product.stock === 0}
          className={`mt-4 px-6 py-3 text-white rounded-lg${
            product.stock > 0
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
