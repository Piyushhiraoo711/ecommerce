import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  User,
  Edit3,
  Copy,
  Settings,
  LogOut,
  Shield,
  Calendar,
  LogOutIcon,
} from "lucide-react";
import { logoutUser } from "../../slice/userSlice";
import toast from "react-hot-toast";

const MyProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user?.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    dispatch(logoutUser());
    toast.success("Logged Out Successfully");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="text-center">
          <div className="mb-6">
            <User size={64} className="mx-auto text-slate-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            No Profile Available
          </h1>
          <p className="text-slate-400 text-lg">
            Please login to view your profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="relative">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 shadow-2xl border border-slate-700 hover:border-slate-600 transition-all duration-300">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2">
                {/* <Sparkles className="text-amber-400" size={24} /> */}
                {/* <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                  {getMembershipBadge()}
                </span> */}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200"
                >
                  <Settings
                    size={24}
                    className="text-slate-400 hover:text-slate-200"
                  />
                </button>
                {showOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-xl shadow-xl z-10 overflow-hidden border border-slate-600">
                    <button
                      onClick={() => navigate("/update-profile")}
                      className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-600 flex items-center gap-2 transition-all"
                    >
                      <Edit3 size={16} />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-red-400 hover:bg-slate-600 flex items-center gap-2 transition-all border-t border-slate-600"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-75 animate-pulse"></div>
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName}`
                  }
                  alt="Profile"
                  className="relative w-40 h-40 rounded-full border-4 border-slate-800 shadow-2xl object-cover"
                />
                {user?.role === "admin" && (
                  <div className="absolute bottom-2 right-2 bg-gradient-to-r from-amber-400 to-amber-500 p-2 rounded-full">
                    <Shield size={20} className="text-slate-900" />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="mb-2">
                  <h1 className="text-4xl font-bold text-white mb-1">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                    {user?.role === "admin" ? "Administrator" : "Customer"}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-8"></div>

            <div className="mb-8">
              <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-slate-700 rounded-xl border border-slate-600 hover:border-slate-500 transition-all group cursor-pointer">
                  <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-all">
                    <Mail className="text-blue-400" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-slate-200 font-medium truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="flex-shrink-0 p-2 hover:bg-slate-600 rounded-lg transition-all"
                  >
                    <Copy
                      size={18}
                      className={`${
                        copied ? "text-green-400" : "text-slate-400"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-700 rounded-xl border border-slate-600 hover:border-slate-500 transition-all group">
                  <div className="p-3 bg-green-500 bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-all">
                    <Phone className="text-green-400" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">
                      Phone
                    </p>
                    <p className="text-slate-200 font-medium">
                      {user?.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-700 rounded-xl border border-slate-600 hover:border-slate-500 transition-all group">
                  <div className="p-3 bg-purple-500 bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-all">
                    <User className="text-purple-400" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">
                      User ID
                    </p>
                    <p className="text-slate-200 font-medium font-mono text-sm truncate">
                      {user?._id}
                    </p>
                  </div>
                  <button className="flex-shrink-0 p-2 hover:bg-slate-600 rounded-lg transition-all">
                    <Copy size={18} className="text-slate-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/update-profile")}
                className="relative group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 overflow-hidden"
              >
                <span className="relative flex items-center justify-center gap-2">
                  <Edit3 size={18} />
                  Edit Profile
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="relative group px-6 py-3 bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-600 hover:border-slate-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogOutIcon color="red" size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Last updated: <span className="text-slate-400">Nov 20, 2025</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
