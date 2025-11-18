import React from "react";
import { useSelector } from "react-redux";
import { Mail, Phone, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { H1Icon } from "@heroicons/react/24/outline";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex justify-center items-center bg-dark p-4">
      {user ? (
        <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md">
          <div className="flex flex-col items-center">
            <img
              src={user?.avatar || "https://i.pravatar.cc/150"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-gray-200 shadow-md"
            />
            <h2 className="mt-4 text-gray-800 text-2xl font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>
          </div>

          <hr className="my-6" />

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" size={20} />
              <p className="text-gray-700">{user?.email}</p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-green-600" size={20} />
              <p className="text-gray-700">
                {user?.phone || "No phone provided"}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-red-600 mt-1" size={20} />
              <div>
                <p className="text-gray-700 font-medium">Address</p>
                <p className="text-gray-600 text-sm">
                  {user?.address?.street}, {user?.address?.city},{" "}
                  {user?.address?.state} - {user?.address?.zipCode}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/update-profile")}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div>
          <h1>No profile Avaiable</h1>
          <h3>Please login</h3>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
