import React from "react";
import AllProductsCard from "../card/AllProductsCard";

const AllProducts = () => {
  const users = [
    {
      userId: 1,
      firstName: "John",
      lastName: "Doe",
      email: "mclkdjfkxs",
      totalOrders: 15,
      totalAmount: 12500,
    },
    {
      userId: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "asdfasdf",
      totalOrders: 8,
      totalAmount: 7600,
    },
  ];
  return (
    <>
      <AllProductsCard users={users} />
    </>
  );
};

export default AllProducts;
