const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.cjs");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce-avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const uploadAvatar = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = uploadAvatar;
