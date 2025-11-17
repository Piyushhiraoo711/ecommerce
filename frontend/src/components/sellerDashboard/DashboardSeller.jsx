import React from "react";
import Sidebar from "../Sidebar.jsx";
import Navbar from "../Navbar.jsx";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const DashboardSeller = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar role={user?.role} />
        <div className="flex-1 flex flex-col">
          {/* <Navbar /> */}
          <main className="p-6 flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardSeller;
