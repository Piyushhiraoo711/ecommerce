// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import {
//   HomeIcon,
//   UsersIcon,
//   FolderIcon,
//   CalendarIcon,
//   DocumentTextIcon,
//   ChartPieIcon,
// } from "@heroicons/react/24/outline";
// import { logoutUser } from "../slice/userSlice";
// import toast from "react-hot-toast";

// const Sidebar = ({ role, user }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleLogout = async () => {
//     console.log("logout");
//     await dispatch(logoutUser());
//     toast.success("Logged Out Successfully");
//     navigate("/signin");
//   };
//   const adminLinks = [
//     { name: "Dashboard", icon: HomeIcon, path: "/admin/dashboard" },
//     { name: "All Users", icon: UsersIcon, path: "/admin/all-user" },
//     // { name: "Top Users", icon: UsersIcon, path: "/admin/top-users" },
//     { name: "All Sellers", icon: UsersIcon, path: "/admin/all-seller" },
//     // { name: "Top Sellers", icon: UsersIcon, path: "/admin/top-seller" },
//     { name: "All Products", icon: FolderIcon, path: "/admin/all-products" },
//     // { name: "Top Products", icon: FolderIcon, path: "/admin/top-products" },
//     { name: "All Orders", icon: FolderIcon, path: "/admin/all-orders" },
//   ];

//   const sellerLinks = [
//     // { name: "Dashboard", icon: HomeIcon, path: "/seller/dashboard" },
//     { name: "Add Product", icon: HomeIcon, path: "/seller/create-product" },
//     { name: "My Products", icon: FolderIcon, path: "/seller/get-products" },
//     { name: "My Orders", icon: HomeIcon, path: "/seller/get-orders" },
//     { name: "Logout", icon: HomeIcon, logout: true },
//   ];

//   const links = role === "admin" ? adminLinks : sellerLinks;

//   return (
//     <div className="bg-gray-900 text-white h-screen w-64 flex flex-col justify-between">
//       <div>
//         <div className="text-2xl font-bold p-6 border-b border-gray-700">
//           MyPanel
//         </div>
//         <nav className="mt-6">
//           {links.map((link) =>
//             link.logout ? (
//               // Logout button
//               <button
//                 key={link.name}
//                 onClick={handleLogout}
//                 className="w-full flex items-center px-6 py-3 hover:bg-gray-700 text-left"
//               >
//                 <link.icon className="h-5 w-5 mr-3" />
//                 <span>{link.name}</span>
//               </button>
//             ) : (
//               // Normal Navigation Link
//               <Link
//                 key={link.name}
//                 to={link.path}
//                 className={`flex items-center px-6 py-3 hover:bg-gray-700${
//                   location.pathname.includes(link.path) ? "bg-gray-700" : ""
//                 }`}
//               >
//                 <link.icon className="h-5 w-5 mr-3" />
//                 <span>{link.name}</span>
//               </Link>
//             )
//           )}
//         </nav>
//       </div>

//       <div className="p-6 border-t border-gray-700 flex items-center">
//         <img
//           src={user?.avatar || "https://i.pravatar.cc/40"}
//           alt="User"
//           className="w-10 h-10 rounded-full mr-3"
//         />
//         <div>
//           <p className="font-medium">
//             {user?.firstName} {user?.lastName}
//           </p>
//           <p className="text-xs text-gray-400">{role}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import { useState } from "react";
import {
  User,
  Package,
  ShoppingCart,
  PlusSquare,
  Settings,
  LogOut,
} from "lucide-react";
import DashboardSeller from "./sellerDashboard/SellerLayout";
import SellerDashboard from "./sellerDashboard/SellerDashboard";
import CreateProduct from "./sellerDashboard/CreateProduct";
import GetOrders from "./sellerDashboard/GetOrders";
import GetProducts from "./sellerDashboard/GetProducts";

function Sidebar() {
  const [activePage, setActivePage] = useState("profile");

  const menuItems = [
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    {
      id: "my-products",
      label: "My Products",
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: "my-orders",
      label: "My Orders",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      id: "add-product",
      label: "Add Product",
      icon: <PlusSquare className="w-5 h-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
    { id: "logout", label: "Logout", icon: <LogOut className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "profile":
        return (
          <div className="p-6 text-xl">
            <SellerDashboard />
          </div>
        );
      case "my-products":
        return (
          <div className="p-6 text-xl">
            <CreateProduct />
          </div>
        );
      case "my-orders":
        return (
          <div className="p-6 text-xl">
            <GetOrders />
          </div>
        );
      case "add-product":
        return (
          <div className="p-6 text-xl">
            <GetProducts />
          </div>
        );
      default:
        return <div className="p-6 text-xl">Welcome!</div>;
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-white shadow-lg p-4 flex flex-col">
          <h2 className="text-2xl font-bold mb-6">Seller Panel</h2>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl text-left text-lg transition
${activePage === item.id ? "bg-blue-500 text-white" : "hover:bg-blue-100"}
`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </div>
    </>
  );
}

export default Sidebar;
