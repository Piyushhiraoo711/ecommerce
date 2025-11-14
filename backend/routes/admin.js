import express from "express";
import verifyToken from "../middleware/verifyToken.js"
import authorizeRoles from "../middleware/authorizeRoles.js";
import { deleteUser, getAdminDashboard, topProducts, topSellers, topUsers, totalOrdersByStatus, totalSellers, totalUsers} from "../controller/adminController.js";

const router = express.Router();

router.route("/:id").delete(verifyToken, authorizeRoles("admin"), deleteUser);

router.route("/get-admin-dashboard").get(verifyToken, authorizeRoles("admin"), getAdminDashboard);

router.route("/top-sellers").get(verifyToken, authorizeRoles("admin"), topSellers);

router.route("/top-users").get(verifyToken , authorizeRoles("admin"), topUsers);

router.route("/total-user").get(verifyToken, authorizeRoles("admin") , totalUsers);

router.route("/total-seller").get(verifyToken , authorizeRoles("admin"), totalSellers);

router.route("/top-product").get(verifyToken, authorizeRoles("admin"), topProducts);

router.route("/total-order-by-status").get(verifyToken , authorizeRoles("admin"), totalOrdersByStatus);
export default router;