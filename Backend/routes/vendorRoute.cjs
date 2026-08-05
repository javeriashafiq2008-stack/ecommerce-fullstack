const express = require("express");
const router =  express.Router();

const {
  getVendorProducts,
  updateProduct,
  deleteProduct,
  createProduct,
  getVendorOrders,
  getVendorDashboardStats,
} = require("../controllers/productController.cjs");

const authorize = require("../middleware/authorize.cjs");
const authenticate = require("../middleware/authenticate.cjs");
const upload = require("../middleware/upload.cjs"); 

router.post(
  "/add",
  authenticate,
  authorize("vendor"),
 upload.array("images", 6),
  createProduct
);

router.get(
  "/all",
  authenticate,
  authorize("vendor"),
  getVendorProducts
);

router.put(
  "/update/:id",
  authenticate,
  authorize("vendor"),
  upload.array("images", 6),
  updateProduct

);

router.delete(
  "/delete/:id",
  authenticate,
  authorize("vendor"),
  deleteProduct
);

router.get(
  "/orders",
  authenticate,
  authorize("vendor"),
  getVendorOrders
);

router.get(
  "/dashboard-stats",
  authenticate,
  authorize("vendor"),
  getVendorDashboardStats
);

module.exports = router;