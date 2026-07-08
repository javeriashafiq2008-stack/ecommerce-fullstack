const express = require("express");
const router = express.Router();

const {
  getVendorProducts,
  updateProduct,
  deleteProduct,
  createProduct,
} = require("../controllers/productController.cjs");

const authorize = require("../middleware/authorize.cjs");
const authenticate = require("../middleware/authenticate.cjs");
const upload = require("../middleware/upload.cjs"); // <-- Add this

router.post(
  "/add",
  authenticate,
  authorize("vendor"),
  upload.single("image"), // <-- Add this
  createProduct
);

router.get(
  "/vendor/all",
  authenticate,
  authorize("vendor"),
  getVendorProducts
);

router.put(
  "/update/:id",
  authenticate,
  authorize("vendor"),
  updateProduct
);

router.delete(
  "/delete/:id",
  authenticate,
  authorize("vendor"),
  deleteProduct
);

module.exports = router;