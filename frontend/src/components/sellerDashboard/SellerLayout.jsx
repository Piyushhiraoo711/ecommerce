import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import {
  User,
  ShoppingCart,
  Package,
  PlusSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { logoutUser } from "../../slice/userSlice";
import toast from "react-hot-toast";

const SellerLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activePage, setActivePage] = useState("dashboard");
  const menuItems = [
    { id: "dashboard", label: "My Dashboard", icon: <User /> },
    { id: "create-product", label: "Add Product", icon: <PlusSquare /> },
    { id: "get-products", label: "My Products", icon: <Package /> },
    { id: "get-orders", label: "My Orders", icon: <ShoppingCart /> },
    { id: "my-profile", label: "My Profile", icon: <User /> },
    { id: "logout", label: "Logout", icon: <LogOut /> },
  ];
  const handleMenuClick = (id) => {
    setActivePage(id);

    if (id === "logout") {
      dispatch(logoutUser());
      toast.success("Logged Out successfully");
      navigate("/signin");
      return;
    }
    navigate(`/seller/${id}`);
  };
  return (
    <>
      <div className="flex h-screen bg-gray">
        <div className="w-64 shadow-lg p-4 bg-indigo-500 flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {user?.firstName} {user?.lastName}
          </h2>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
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

export default SellerLayout;
