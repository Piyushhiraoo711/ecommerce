import React from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { logoutUser } from "../../slice/userSlice";

const UserLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/signin");
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const navigation = [
    { name: "Home", href: "/user/home" },
    { name: "My Orders", href: "/user/my-orders" },
    { name: "Cart", href: "/user/cart" },
    { name: "Profile", href: "/user/profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Disclosure as="nav" className="bg-gray-800 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 justify-between items-center">
            <div
              onClick={() => navigate("/user/home")}
              className="flex items-center gap-2 text-xl font-semibold cursor-pointer"
            >
              <span className="text-indigo-400">Ecom</span>
            </div>

            <div className="hidden sm:flex space-x-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700",
                      "px-3 py-2 rounded-md text-sm font-medium"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Menu as="div" className="relative">
                <MenuButton className="flex rounded-full focus:outline-none">
                  <img
                    src="https://i.pravatar.cc/40"
                    className="w-8 h-8 rounded-full"
                    alt="user"
                  />
                </MenuButton>

                <MenuItems className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 text-white z-20">
                  <MenuItem>
                    <NavLink
                      to="/user/profile"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      Your Profile
                    </NavLink>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>

            <div className="sm:hidden flex items-center">
              <DisclosureButton className="text-gray-300 hover:text-white">
                <Bars3Icon className="w-6 h-6" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden px-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                classNames(
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700",
                  "block px-3 py-2 rounded-md text-base font-medium"
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
        </DisclosurePanel>
      </Disclosure>

      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
