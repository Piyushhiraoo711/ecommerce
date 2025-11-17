import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomInput from "../customFields/CustomInput";
import CustomButton from "../customFields/CustomButton";
import CustomSelect from "../customFields/CustomSelect";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginUser } from "../../slice/userSlice";

export default function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
    role: "",
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
    const { email, password, role } = user;

    if (!email || !password || !role) {
      return toast.error("Please fill in all fields");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    try {
      const resultAction = await dispatch(loginUser({ email, password, role }));

      if (loginUser.rejected.match(resultAction)) {
        return toast.error(resultAction.payload || "Invalid credentials");
      }

      const userRole = resultAction.payload?.user?.role;
      toast.success(resultAction.payload?.message || "Login successful!");

      switch (userRole) {
        case "admin":
          navigate("/admin");
          break;
        case "seller":
          navigate("/seller");
          break;
        default:
          navigate("/");
          break;
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
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            {/* email */}
            <CustomInput
              id="email"
              label="Email Address"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email address"
            />

            {/* password */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    to="/forget-password"
                    className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={user.password}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-black px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
              </div>
            </div>

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

            {/* sign in button */}
            <CustomButton type="submit">Sign In</CustomButton>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
            Don't have an account?
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
