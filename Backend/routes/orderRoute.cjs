const express = require("express");
const router = express.Router();

const { checkout, getMyOrders } = require("../controllers/checkoutController.cjs");
const authenticate = require("../middleware/authenticate.cjs");

router.post("/", authenticate, checkout);
router.get("/myorders", authenticate, getMyOrders);

module.exports = router;
