import React, { useRef, useState, useEffect } from "react";
import CustomButton from "../customFields/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { otpVerify } from "../../slice/userSlice";
import toast from "react-hot-toast";

const OtpVerify = ({ length = 6, onSubmit }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Handle input change
  const handleChange = (e, index) => {
    const { value } = e.target;
    if (!/^[0-9]?$/.test(value)) return; // only digits allowed

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle key press (for backspace navigation)
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, length);
    if (!/^[0-9]+$/.test(pasted)) return;

    const digits = pasted.split("");
    const newOtp = Array(length).fill("");
    digits.forEach((d, i) => (newOtp[i] = d));
    setOtp(newOtp);

    if (digits.length === length) {
      inputsRef.current[length - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length === length) {
      onSubmit?.(otpValue);
    } else if (otpValue.length < length) {
      toast.error("Please enter complete OTP");
      return;
    }

    console.log("Submitted OTP:", user?.email, otpValue);

    const resultAction = await dispatch(
      otpVerify({ email: user?.email, otp: otpValue })
    );

    if (otpVerify.fulfilled.match(resultAction)) {
      console.log("OTP verified successfully", resultAction.payload);
      navigate("/");
    } else {
      console.error("OTP verification failed", resultAction.payload);
    }
  };

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow dark:bg-gray-800">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">
          Mobile Phone Verification
        </h1>
        <p className="text-[15px] text-slate-500">
          Enter the {length}-digit verification code that was sent to your phone
          number.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div
          className="flex items-center justify-center gap-3"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:bg-white/5 dark:text-white dark:border-white/10 dark:focus:border-indigo-500"
            />
          ))}
        </div>

        <div className="max-w-[260px] mx-auto mt-4">
          <CustomButton type="submit">Send OTP</CustomButton>
        </div>
      </form>

      <div className="text-sm text-slate-500 mt-4">
        Didn’t receive code?
        <Link
          to=""
          className="font-medium text-indigo-500 hover:text-indigo-600"
        >
          Resend
        </Link>
      </div>
    </div>
  );
};

export default OtpVerify;
