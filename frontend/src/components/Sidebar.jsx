import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import { logoutUser } from "../slice/userSlice";
import toast from "react-hot-toast";

const Sidebar = ({ role, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    console.log("logout");
    await dispatch(logoutUser());
    toast.success("Logged Out Successfully");
    navigate("/signin");
  };
  const adminLinks = [
    { name: "Dashboard", icon: HomeIcon, path: "/admin/dashboard" },
    { name: "All Users", icon: UsersIcon, path: "/admin/all-user" },
    // { name: "Top Users", icon: UsersIcon, path: "/admin/top-users" },
    { name: "All Sellers", icon: UsersIcon, path: "/admin/all-seller" },
    // { name: "Top Sellers", icon: UsersIcon, path: "/admin/top-seller" },
    { name: "All Products", icon: FolderIcon, path: "/admin/all-products" },
    // { name: "Top Products", icon: FolderIcon, path: "/admin/top-products" },
    { name: "All Orders", icon: FolderIcon, path: "/admin/all-orders" },
  ];

  const sellerLinks = [
    // { name: "Dashboard", icon: HomeIcon, path: "/seller/dashboard" },
    { name: "Add Product", icon: HomeIcon, path: "/seller/create-product" },
    { name: "My Products", icon: FolderIcon, path: "/seller/get-products" },
    { name: "My Orders", icon: HomeIcon, path: "/seller/get-orders" },
    { name: "Logout", icon: HomeIcon, logout: true },
  ];

  const links = role === "admin" ? adminLinks : sellerLinks;

  return (
    <div className="bg-gray-900 text-white h-screen w-64 flex flex-col justify-between">
      <div>
        <div className="text-2xl font-bold p-6 border-b border-gray-700">
          MyPanel
        </div>
        <nav className="mt-6">
          {links.map((link) =>
            link.logout ? (
              // Logout button
              <button
                key={link.name}
                onClick={handleLogout}
                className="w-full flex items-center px-6 py-3 hover:bg-gray-700 text-left"
              >
                <link.icon className="h-5 w-5 mr-3" />
                <span>{link.name}</span>
              </button>
            ) : (
              // Normal Navigation Link
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-6 py-3 hover:bg-gray-700 ${
                  location.pathname.includes(link.path) ? "bg-gray-700" : ""
                }`}
              >
                <link.icon className="h-5 w-5 mr-3" />
                <span>{link.name}</span>
              </Link>
            )
          )}
        </nav>
      </div>

      <div className="p-6 border-t border-gray-700 flex items-center">
        <img
          src={user?.avatar || "https://i.pravatar.cc/40"}
          alt="User"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-medium">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
