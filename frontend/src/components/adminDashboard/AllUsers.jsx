import React, { useEffect } from "react";
import AllUsersCard from "../card/AllUsersCard";
import { useDispatch, useSelector } from "react-redux";
import { totalUsers } from "../../slice/adminSlice";


const AllUsers = () => {
  const { totalUser } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(totalUsers());
  }, [dispatch]);

  // const users = [
  //   {
  //     userId: 1,
  //     firstName: "John",
  //     lastName: "Doe",
  //     email: "mclkdjfkxs",
  //     totalOrders: 15,
  //     totalAmount: 12500,
  //   },
  //   {
  //     userId: 2,
  //     firstName: "Jane",
  //     lastName: "Smith",
  //     email: "          asdfasdf",
  //     totalOrders: 8,
  //     totalAmount: 7600,
  //   },
  // ];
  return (
    <>
      {console.log("total user", totalUser)}
      {/* <AllUsersCard users={users} /> */}
    </>
  );
};

export default AllUsers;
