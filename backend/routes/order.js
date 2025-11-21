import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getAllMyOrders,
  getAllOrdersForAdmin,
  getOrderById,
  getSellerStats,
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

router.route("/all-orders-admin").get(verifyToken, authorizeRoles("admin"), getAllOrdersForAdmin);

router.route("/stats").get(verifyToken , authorizeRoles("seller"), getSellerStats);

router.route("/:id").get(verifyToken, authorizeRoles("user", "seller", "admin"), getOrderById);

router.route("/update-status").put(verifyToken, authorizeRoles("admin"), updateOrderStatus);

router.route("/:id").delete(verifyToken, authorizeRoles("seller", "admin"), deleteOrder);

router.route("/cancel-order/:id").delete(verifyToken, authorizeRoles("user"), cancelOrder);



export default router;
