import React, { useEffect } from "react";
import AllSellersCard from "../card/AllSellersCard.jsx";
import { useDispatch, useSelector } from "react-redux";
import { totalSellers } from "../../slice/adminSlice.js";

const AllSellers = () => {
  const dispatch = useDispatch();
  const { totalSeller } = useSelector((state) => state.admin);
  useEffect(() => {
    dispatch(totalSellers());
  }, [dispatch]);

  return (
    <>
      {
        console.log("total seller", totalSeller)
      }
      {/* <AllSellersCard users={users} /> */}
    </>
  );
};

export default AllSellers;
