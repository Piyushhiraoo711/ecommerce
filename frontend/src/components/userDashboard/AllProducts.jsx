import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getProducts } from "../../slice/productSlice";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../customFields/CustomButton";

export default function AllProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, cart, loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleBuyNow = (id) => {
    console.log("Buy Now clicked for product:", id);
  };

  const handleAddToCart = (id) => {
    console.log("Add to cart for product:", id);
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products &&
            products.map((product) => (
              <div
                key={product._id + crypto.randomUUID()}
                className="group relative border p-4 rounded-lg"
              >
                <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                  <Link to={`/product/${product._id}`}>
                    {console.log("sakjdnhskjad")}
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? product.images[0].url
                          : "https://via.placeholder.com/150"
                      }
                      alt={product.name}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </Link>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-white">{product.name}</h3>
                    <p className="mt-1 text-sm text-gray-300">
                      {product.category}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-white">
                    ₹ {product.price}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <CustomButton
                    type="button"
                    onClick={() => handleBuyNow(product._id)}
                  >
                    Buy Now
                  </CustomButton>
                  <CustomButton
                    type="button"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    Add to Cart
                  </CustomButton>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
