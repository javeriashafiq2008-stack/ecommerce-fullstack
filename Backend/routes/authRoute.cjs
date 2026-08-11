const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  changePassword,
} = require("../controllers/authController.cjs");
const authenticate = require("../middleware/authenticate.cjs");
const uploadAvatar = require("../middleware/uploadAvatar.cjs");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/logout", logout);
router.put("/update-profile", authenticate, uploadAvatar.single("avatar"), updateProfile);
router.put("/change-password", authenticate, changePassword);

module.exports = router;
