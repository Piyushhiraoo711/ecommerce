import React, { useState } from "react";
import CustomInput from "../../components/customFields/CustomInput.jsx";
import CustomButton from "../../components/customFields/CustomButton.jsx";
import { toast } from "react-hot-toast";
const CreateProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    images: [],
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setProduct((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);

    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...selectedImages],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting product:", product);
    const { name, description, price, category, brand, stock, images } =
      product;

    if (!name || !description || !price || !category || !brand || !stock) {
      toast.error("Please fill in all fields");
      return;
    } else if (price <= 0) {
      toast.error("Price must be greater than zero");
      return;
    } else if (stock <= 0) {
      toast.error("Stock cannot be zero");
      return;
    } else if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }
  };

  return (
    <>
      <div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            <div>
              <h1>Create Product</h1>
            </div>
            <CustomInput
              id="name"
              label="Product Name"
              name="name"
              type="text"
              value={product.name}
              onChange={handleChange}
              placeholder="Product name"
            />
            <CustomInput
              id="description"
              label="Product Description"
              name="description"
              type="text"
              value={product.description}
              onChange={handleChange}
              placeholder="Product description"
            />
            <CustomInput
              id="price"
              label="Product Price"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              placeholder="Product price"
            />
            <CustomInput
              id="category"
              label="Product Category"
              name="category"
              type="text"
              value={product.category}
              onChange={handleChange}
              placeholder="Product category"
            />
            <CustomInput
              id="brand"
              label="Product Brand"
              name="brand"
              type="text"
              value={product.brand}
              onChange={handleChange}
              placeholder="Product brand"
            />
            <CustomInput
              id="stock"
              label="Product Stock"
              name="stock"
              type="number"
              value={product.stock}
              onChange={handleChange}
              placeholder="Product stock"
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                Product Images
              </label>

              <div className="mt-2">
                <input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 
            focus:outline-2 focus:outline-indigo-600 sm:text-sm dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500 `}
                />
              </div>
            </div>
            <CustomButton type="submit">Add Product</CustomButton>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateProduct;
