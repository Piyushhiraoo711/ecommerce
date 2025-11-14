import express from "express";

import { productSchemaValidate } from "../modelValidation/productValidationModelJoi.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductById,
  updateProduct,
} from "../controller/productController.js";
import verifyToken from "../middleware/verifyToken.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import { validateProductjoi } from "../validation/validateProductJoi.js";
import {upload} from "../middleware/multer.js";

const router = express.Router();

router.route("/").get(getProduct);

router .route("/create") .post( verifyToken, authorizeRoles("seller"), upload.array("images", 10), validateProductjoi(productSchemaValidate), createProduct);

router.route("/:id").put(verifyToken, authorizeRoles("seller", "admin"), updateProduct);

router.route("/:id").get(getProductById);

router.route("/:id").delete(verifyToken, authorizeRoles("seller", "admin"), deleteProduct);

export default router;
