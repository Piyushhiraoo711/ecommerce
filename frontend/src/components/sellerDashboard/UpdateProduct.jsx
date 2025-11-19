import React, { useEffect, useState } from "react";
import CustomInput from "../../components/customFields/CustomInput.jsx";
import CustomButton from "../../components/customFields/CustomButton.jsx";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById, updateProduct } from "../../slice/productSlice.js";

const UpdateProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product } = useSelector((state) => state.product);

  const [productSelected, setProductSelected] = useState(() => product || {
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
  });

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setProductSelected({ ...product });
    }
  }, [product]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setProductSelected((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting product:", product);
    const { name, description, price, category, brand, stock } =
      productSelected;

    if (!name || !description || !price || !category || !brand || !stock) {
      toast.error("Please fill in all fields");
      return;
    } else if (price <= 0) {
      toast.error("Price must be greater than zero");
      return;
    }
    try {
      const res = await dispatch(
        updateProduct({ id, productData: productSelected })
      );
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Product updated successfully!");
        navigate("/seller/dashboard");
      } else {
        toast.error(res.payload || "Failed to update product");
      }
      setProductSelected({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} method="POST" className="space-y-6">
          <div className="text-[15px] text-center">
            <h1>Update Product</h1>
          </div>
          <CustomInput
            id="name"
            label="Product Name"
            name="name"
            type="text"
            value={productSelected.name}
            onChange={handleChange}
            placeholder="Product name"
          />
          <CustomInput
            id="description"
            label="Product Description"
            name="description"
            type="text"
            value={productSelected.description}
            onChange={handleChange}
            placeholder="Product description"
          />
          <CustomInput
            id="price"
            label="Product Price"
            name="price"
            type="number"
            value={productSelected.price}
            onChange={handleChange}
            placeholder="Product price"
          />
          <CustomInput
            id="category"
            label="Product Category"
            name="category"
            type="text"
            value={productSelected.category}
            onChange={handleChange}
            placeholder="Product category"
          />
          <CustomInput
            id="brand"
            label="Product Brand"
            name="brand"
            type="text"
            value={productSelected.brand}
            onChange={handleChange}
            placeholder="Product brand"
          />

          <CustomInput
            id="stock"
            label="Product Stock"
            name="stock"
            type="number"
            value={productSelected.stock}
            onChange={handleChange}
            placeholder="Product stock"
          />
          <CustomButton type="submit">Add Product</CustomButton>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
