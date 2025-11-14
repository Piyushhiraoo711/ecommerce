import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomInput from "../customFields/CustomInput";
import CustomButton from "../customFields/CustomButton";
import CustomSelect from "../customFields/CustomSelect";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { registerUser } from "../../slice/userSlice";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, phone, role, password } = user;
    if (!firstName || !lastName || !email || !phone || !role || !password) {
      toast.error("Please fill in all fields");
      return;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    } else if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      const resultAction = await dispatch(
        registerUser({ firstName, lastName, email, phone, role, password })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload?.message || "Register successful!");
        navigate("/otp-verify");
      } else {
        toast.error(resultAction.payload);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const roleOptions = [
    { value: "user", label: "User" },
    { value: "seller", label: "Seller" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto dark:hidden"
          />
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            className="mx-auto h-10 w-auto not-dark:hidden"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
            Create an a account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            {/*  first name */}
            <CustomInput
              id="firstName"
              label="First Name"
              name="firstName"
              type="firstName"
              value={user.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
            />

            {/* last name */}
            <CustomInput
              id="lastName"
              label="Last Name"
              name="lastName"
              type="lastName"
              value={user.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
            />

            {/* email address */}
            <CustomInput
              id="email"
              label="Email Address"
              name="email"
              type="email"
              value={user.email}
              min={10}
              onChange={handleChange}
              placeholder="Email address"
            />

            {/* phone number */}
            <CustomInput
              id="phone"
              label="Phone Number"
              name="phone"
              type="emphoneail"
              value={user.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />

            {/* role selection */}
            <CustomSelect
              id="role"
              label="Select Role"
              name="role"
              value={user.role}
              onChange={handleChange}
              options={roleOptions}
              placeholder="Select your role"
            />

            {/* password  */}

            <CustomInput
              id="password"
              label="Password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Enter password"
            />

            {/* sign up button */}
            <CustomButton type="submit">Sign up</CustomButton>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
            Already have an account?
            <Link
              to="/signin"
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
