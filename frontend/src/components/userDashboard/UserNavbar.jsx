import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Home,
  List,
  LogOut,
  User2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../slice/userSlice";
import { toast } from "react-hot-toast";

const UserNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());
    console.log("result", result);

    if (logoutUser.fulfilled.match(result)) {
      toast.success("Logged out successfully");
      navigate("/");
    } else {
      toast.error(result.payload || "Logout failed");
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Ecom
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <Home size={18} /> Home
          </Link>

          <Link
            to="/my-orders"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <List size={18} /> My Orders
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <ShoppingCart size={18} /> Cart
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              >
                <User size={18} /> Profile
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md py-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    View Profile
                  </Link>

                  <button
                    onClick={() => handleLogout()}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/signin"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <ShoppingCart size={18} /> Sign in
            </Link>
          )}
        </div>

        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-md py-4 px-6 space-y-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-700 text-lg hover:text-blue-600"
          >
            <Home size={18} /> Home
          </Link>

          <Link
            to="/my-orders"
            className="flex items-center gap-2 text-gray-700 text-lg hover:text-blue-600"
          >
            <List size={18} /> My Orders
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-2 text-gray-700 text-lg hover:text-blue-600"
          >
            <ShoppingCart size={18} /> Cart
          </Link>

          {user ? (
            <div>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-700 text-lg hover:text-blue-600"
              >
                <User size={18} /> Profile
              </Link>

              <button
                onClick={() => handleLogout()}
                className="flex items-center gap-2 text-red-600 text-lg hover:text-red-800"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <User2 size={18} /> Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
