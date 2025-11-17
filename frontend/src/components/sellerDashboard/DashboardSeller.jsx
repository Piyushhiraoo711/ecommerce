import React from "react";
import Sidebar from "../Sidebar.jsx";
import Navbar from "../Navbar.jsx";
import { useSelector } from "react-redux";

const DashboardSeller = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      <Navbar />
      <Sidebar role={user?.role} />
    </>
  );
};

export default DashboardSeller;
