import React, { Profiler, useEffect, useState } from "react";
import Sidebar from "../Sidebar.jsx";
import Navbar from "../Navbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Users,
  ShoppingBag,
  Package,
  ClipboardList,
  LogOut,
} from "lucide-react";
import { logoutUser } from "../../slice/userSlice.js";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");

  // useEffect(() => {
  //   dispatch(fetchAdminDashboard());
  // }, [dispatch]);

  useEffect(() => {});

  const handleClick = (id) => {
    setActivePage(id);
    if (id === "logout") {
      dispatch(logoutUser());
      toast.success("Logged Out successfully");
      navigate("/signin");
      return;
    }
    navigate(`/admin/${id}`);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <ClipboardList /> },
    { id: "all-user", label: "All Users", icon: <Users /> },
    { id: "all-seller", label: "All Sellers", icon: <ShoppingBag /> },
    { id: "all-products", label: "All Products", icon: <Package /> },
    { id: "top-users", label: "Top Users", icon: <ClipboardList /> },
    { id: "top-sellers", label: "Top Sellers", icon: <ClipboardList /> },
    { id: "top-products", label: "Top Products", icon: <ClipboardList /> },
    { id: "order-by-status", label: "Order Status", icon: <ClipboardList /> },
    { id: "my-profile", label: "My Profile", icon: <Users /> },
    { id: "logout", label: "Logout", icon: <LogOut /> },
  ];

  return (
    <>
      <div className="flex h-screen bg-gray">
        <div className="w-64 bg-indigo-500 shadow-lg p-4 flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {user?.firstName} {user?.lastName}
          </h2>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl
               ${
                  activePage === item.id
                    ? "bg-blue-400 text-white"
                    : "hover:bg-indigo-200"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto p-6 text-xl">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
