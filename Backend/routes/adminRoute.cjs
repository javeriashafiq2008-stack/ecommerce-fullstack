const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllProducts,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAnalytics,
} = require("../controllers/adminController.cjs");

const authenticate = require("../middleware/authenticate.cjs");
const authorize = require("../middleware/authorize.cjs");
const uploadAvatar = require("../middleware/uploadAvatar.cjs");

const adminOnly = [authenticate, authorize("admin")];

router.get("/dashboard", ...adminOnly, getDashboardStats);
router.get("/analytics", ...adminOnly, getAnalytics);

router.get("/users", ...adminOnly, getAllUsers);
router.put("/users/:id", ...adminOnly, updateUser);
router.delete("/users/:id", ...adminOnly, deleteUser);

router.get("/products", ...adminOnly, getAllProducts);
router.delete("/products/:id", ...adminOnly, deleteProduct);
router.delete("/product/:id", ...adminOnly, deleteProduct);

router.get("/orders", ...adminOnly, getAllOrders);
router.put("/orders/:id/status", ...adminOnly, updateOrderStatus);
router.put("/order/:id", ...adminOnly, updateOrderStatus);

router.get("/profile", ...adminOnly, getAdminProfile);
router.put("/profile", ...adminOnly, uploadAvatar.single("avatar"), updateAdminProfile);
router.put("/change-password", ...adminOnly, changeAdminPassword);

module.exports = router;
