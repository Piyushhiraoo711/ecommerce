import express from "express";
import {
  createUser,
  deleteUser,
  forgetPassword,
  forgetPasswordOtp,
  getUser,
  getUserById,
  loginUser,
  logoutUser,
  resendOtp,
  resetPassword,
  updateUser,
  verifyOtp,
} from "../controller/userController.js";
import verifyToken from "../middleware/verifyToken.js";
import { validateUserjoi } from "../validation/validateUserJoi.js";
import { userSchemaValidate } from "../modelValidation/userValidationModelJoi.js";

const router = express.Router();

router.get("/me", verifyToken, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.route("/").get(getUser);
router.route("/register").post(validateUserjoi(userSchemaValidate), createUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/verify-otp").post(verifyOtp);
router.route("/resend-otp").post(resendOtp);
router.route("/forget-password").post(forgetPassword);
router.route("/forget-otp").post(forgetPasswordOtp);
router.route("/reset-password").post(resetPassword);
router.route("/:id").get(getUserById);
router.route("/:id").put(verifyToken, updateUser);
router.route("/:id").delete(verifyToken, deleteUser);

export default router;
