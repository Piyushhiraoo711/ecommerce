import React, { useState } from "react";
import CustomInput from "../../components/customFields/CustomInput.jsx";
import CustomButton from "../../components/customFields/CustomButton.jsx";
import { toast } from "react-hot-toast";

const UpdateProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setProduct((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting product:", product);
    const { name, description, price, category, brand } = product;

    if (!name || !description || !price || !category || !brand) {
      toast.error("Please fill in all fields");
      return;
    } else if (price <= 0) {
      toast.error("Price must be greater than zero");
      return;
    }
    console.log(product)
  };

  return (
    <div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} method="POST" className="space-y-6">
          <div>
            <h1>Update Product</h1>
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
          <CustomButton type="submit">Add Product</CustomButton>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
