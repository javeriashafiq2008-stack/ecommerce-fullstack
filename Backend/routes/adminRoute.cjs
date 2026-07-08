const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  getAllProducts,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/adminController.cjs");

const authenticate = require("../middleware/authenticate.cjs");
const authorize = require("../middleware/authorize.cjs");

// Dashboard
router.get(
  "/dashboard",
  authenticate,
  authorize("admin"),
  getDashboardStats
);

// Users
router.get(
  "/users",
  authenticate,
  authorize("admin"),
  getAllUsers
);

// Products
router.get(
  "/products",
  authenticate,
  authorize("admin"),
  getAllProducts
);

router.delete(
  "/products/:id",
  authenticate,
  authorize("admin"),
  deleteProduct
);

// Orders
router.get(
  "/orders",
  authenticate,
  authorize("admin"),
  getAllOrders
);

router.put(
  "/orders/:id/status",
  authenticate,
  authorize("admin"),
  updateOrderStatus
);

module.exports = router;