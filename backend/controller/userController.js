import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../services/emailServices.js";
import mailTextContent from "../services/mailTextContent.js";
import otpVerificationContent from "../services/otpVerificationContent.js";
import generateOTP from "../utils/generateOTP.js";

const TEST_OTP = "123456";

export const getUser = async (req, res) => {
  try {
    const user = await User.find();
    if (user) {
      console.log(user);
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    console.log("req.body");
    const { firstName, lastName, email, password, phone, address, role } =
      req.body;
    console.log(firstName, lastName, email, password, phone, address, role);
    let user = await User.findOne({ email });
    // if (user) {
    //   return res.status(409).json({
    //     success: false,
    //     message: "User with this email already exits in.",
    //   });
    // }

    if (user && !user.isOtpVerify) {
      return res.status(409).json({
        success: false,
        message:
          "User with this email already exits. Please verify your account.",
      });
    }

    const encryptPassword = await bcrypt.hash(password, 10);

    user = new User({
      firstName,
      lastName,
      email,
      password: encryptPassword,
      phone,
      address,
      role,
    });

    // otp generation
    const otp = generateOTP(6);
    // user.otpVerify = otp;
    user.otpVerify = TEST_OTP; // for testing purpose
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    // await sendMail(
    //   email,
    //   "Welcome to Ecommerce",
    //   "",
    //   otpVerificationContent(firstName, otp)
    // );

    return res.status(201).json({
      success: true,
      message: "OTP send to Registered email",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // otp expire
    if (!user.otpExpire || user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request for resend otp",
      });
    }

    // otp verify
    // if (String(user.otpVerify) !== String(otp)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid OTP.",
    //   });
    // }

    // testing purpose
    if (String(TEST_OTP) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    user.otpVerify = null;
    user.otpExpire = null;
    user.isOtpVerify = true;
    // user.isAccountVerified = true;
    await user.save();

    // await sendMail(
    //   email,
    //   "Welcome to our Ecommerce",
    //   "",
    //   mailTextContent(user.firstName, email, user.role)
    // );

    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        message: "User Verified successfully",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    console.log("user", user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isOtpVerify) {
      return res.status(400).json({
        success: false,
        message: "Account already verified. Please login.",
      });
    }

    const otp = generateOTP(6);
    user.otpVerify = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendMail(
      email,
      "Welcome to Ecommerce",
      "",
      otpVerificationContent(user.firstName, otp)
    );

    res.status(200).json({
      success: true,
      message: "OTP sent to your register email.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email incorrect",
      });
    }

    const otp = generateOTP(6);
    user.otpVerify = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;
    user.isOtpVerify = false;
    await user.save();

    await sendMail(
      email,
      "Forget Password OTP Request",
      "",
      otpVerificationContent(user.firstName, otp)
    );

    res.status(200).json({
      success: true,
      message: "OTP sent to your register email.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgetPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.otpExpire || user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request for resend otp",
      });
    }

    if (String(user.otpVerify) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // if (!user.isOtpVerify) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "OTP not verified. Please verify before resetting password.",
    //   });
    // }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otpVerify = null;
    user.otpExpire = null;
    user.isOtpVerify = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(email, password, role);

    if (!(email && password && role)) {
      res.status(400).json({
        message: "Someting is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect email ",
        success: false,
      });
    }

    if (!user.isOtpVerify) {
      return resetPassword.json({
        success: false,
        message: "Account is not verified, Please verify your account",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Incorrect password.",
        success: false,
      });
    }

    if (role != user.role) {
      return res.status(400).json({
        message: `Account doesn't exists with current role${role}. `,
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back${user.firstName}`,
        user,
        success: true,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    return res.json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updateUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    console.log(updateUser);

    if (!updateUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      updateUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    console.log("shadjbs");
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
