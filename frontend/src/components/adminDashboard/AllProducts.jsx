import React, { useEffect } from "react";
import AllProductsCard from "../card/AllProductsCard";
import { useDispatch, useSelector } from "react-redux";
import { allProducts } from "../../slice/adminSlice";

const AllProducts = () => {
  const { allProduct } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allProducts());
  }, [dispatch]);

  return (
    <>
      {console.log("all product", allProduct)}
      {/* <AllProductsCard users={users} /> */}
    </>
  );
};

export default AllProducts;
