import express from "express";
import verifyToken from "../middleware/verifyToken.js"
import authorizeRoles from "../middleware/authorizeRoles.js";
import {
  addToCart,
  getMyCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controller/cartController.js";
import { checkout } from "../controller/checkOutController.js";
const router = express.Router();

router.route("/add").post(verifyToken, authorizeRoles("user"), addToCart);
router.route('/').get(verifyToken, authorizeRoles("user"), getMyCart);
router.route("/update").put(verifyToken, authorizeRoles("user"), updateCartItem);
router.route("/remove/:id").delete(verifyToken , authorizeRoles('user'), removeFromCart);
router.route("/clear").delete(verifyToken, authorizeRoles("user"), clearCart);
router.route("/checkout").post(verifyToken , authorizeRoles("user"), checkout)

export default router;
