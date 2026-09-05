const express = require("express");
const User = require("./models/userModel.cjs");
const Product = require("./models/productModel.cjs");
const Cart = require("./models/cartModel.cjs");
const CartItem = require("./models/cartitemModel.cjs");
require("./models/association.cjs");

const authRoute = require("./routes/authRoute.cjs");
const vendorRoute = require("./routes/vendorRoute.cjs");
const catalogRoute = require("./routes/catalogRoute.cjs");
const cartRoute = require("./routes/cartRoute.cjs");
const checkoutRoute = require("./routes/orderRoute.cjs");
const adminRoute = require("./routes/adminRoute.cjs");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://ecommerce-fullstack-navy.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || (typeof origin === "string" && origin.endsWith(".vercel.app"))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// Health Check Routes (Must be before 404 handler)
// =========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Ecommerce API is running successfully!",
    timestamp: new Date().toISOString()
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Ecommerce API is running successfully!",
    timestamp: new Date().toISOString()
  });
});

// =========================
// API Routes
// Mounted under both '/api' and '/' to ensure compatibility
// whether Vercel serverless proxy preserves or strips the '/api' prefix
// =========================
const apiRouter = express.Router();
apiRouter.use("/auth", authRoute);
apiRouter.use("/vendor", vendorRoute);
apiRouter.use("/products", catalogRoute);
apiRouter.use("/cart", cartRoute);
apiRouter.use("/checkout", checkoutRoute);
apiRouter.use("/admin", adminRoute);

app.use("/api", apiRouter);
app.use("/", apiRouter);

// =========================
// 404 Handler (MUST be after all routes)
// =========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
    path: req.originalUrl || req.url
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "An internal server error occurred.",
    error: err.message
  });
});

module.exports = app;