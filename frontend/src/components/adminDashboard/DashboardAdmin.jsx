import React, { useEffect } from "react";
import Sidebar from "../Sidebar.jsx";
import Navbar from "../Navbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboard } from "../../slice/adminSlice.js";

const DashboardAdmin = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Sidebar role={user?.role} />
    </>
  );
};

export default DashboardAdmin;
