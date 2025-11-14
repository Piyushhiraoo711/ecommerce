import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../customFields/CustomInput";
import CustomButton from "../customFields/CustomButton";

export default function ResetOtp() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    password: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);
    navigate('/signin');
  };

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
            Reset your password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            {/* password */}
            <CustomInput
              id="password"
              label="New Password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              placeholder="New Password"
            />

            {/* submit button */}
            <CustomButton type="submit">Submit</CustomButton>
          </form>
        </div>
      </div>
    </>
  );
}
