import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CustomInput from "../customFields/CustomInput";
import CustomButton from "../customFields/CustomButton";
import { updatedUser } from "../../slice/userSlice";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    if (user) {
      setUpdateUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["street", "city", "state", "zipCode"].includes(name)) {
      setUpdateUser((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setUpdateUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      phone,
      address: { street, city, state, zipCode },
    } = updateUser;

    console.log(firstName, lastName, phone, street, city, state, zipCode);

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !street ||
      !city ||
      !state ||
      !zipCode
    ) {
      return toast.error("Please fill in all fields");
    } else if (zipCode.length < 6) {
      return toast.error("Zipcode must be at least 6 digits");
    }

    try {
      const resultAction = await dispatch(
        updatedUser({ userId: user._id, updatedData: updateUser })
      );

      if (updatedUser.rejected.match(resultAction)) {
        return toast.error(resultAction.payload || "Invalid credentials");
      }
      toast.success(resultAction.payload?.message || "update successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="mx-auto h-10 w-auto not-dark:hidden"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
          Update your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} method="POST" className="space-y-6">
          <CustomInput
            id="firstName"
            label="First Name"
            name="firstName"
            type="text"
            value={updateUser.firstName}
            onChange={handleChange}
            placeholder="First Name"
          />

          <CustomInput
            id="lastName"
            label="Last Name"
            name="lastName"
            type="text"
            value={updateUser.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />

          <CustomInput
            id="phone"
            label="Phone Number"
            name="phone"
            type="text"
            value={updateUser.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />

          <CustomInput
            id="street"
            label="Street"
            name="street"
            type="text"
            value={updateUser.address.street}
            onChange={handleChange}
            placeholder="Street"
          />

          <CustomInput
            id="city"
            label="City"
            name="city"
            type="text"
            value={updateUser.address.city}
            onChange={handleChange}
            placeholder="City"
          />

          <CustomInput
            id="state"
            label="State"
            name="state"
            type="text"
            value={updateUser.address.state}
            onChange={handleChange}
            placeholder="State"
          />

          <CustomInput
            id="zipCode"
            label="ZipCode"
            name="zipCode"
            type="text"
            value={updateUser.address.zipCode}
            onChange={handleChange}
            placeholder="Zipcode"
          />

          <CustomButton type="submit">Update</CustomButton>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
