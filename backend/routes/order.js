import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getAllMyOrders,
  getOrderById,
  getUsersOrders,
  updateOrderStatus,
} from "../controller/orderController.js";
import { validateOrderjoi } from "../validation/validateOrderJoi.js";
import { orderSchemaValidate } from "../modelValidation/orderValidationModelJoi.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

const router = express.Router();

router.route("/create").post(validateOrderjoi(orderSchemaValidate), verifyToken, authorizeRoles("user"),  createOrder);

router.route("/my-orders").get(verifyToken , authorizeRoles("user"), getAllMyOrders)

router.route("/user-orders").get(verifyToken, authorizeRoles("seller", "admin"), getUsersOrders);

router.route("/:id").get(verifyToken, authorizeRoles("user", "seller", "admin"), getOrderById);

router.route("/:id").put(verifyToken, authorizeRoles("seller", "admin"), updateOrderStatus);

router.route("/:id").delete(verifyToken, authorizeRoles("seller", "admin"), deleteOrder);

router.route("/cancel-order/:id").delete(verifyToken, authorizeRoles("user"), cancelOrder)

export default router;
