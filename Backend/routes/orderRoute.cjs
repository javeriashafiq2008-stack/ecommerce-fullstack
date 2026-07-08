const express = require("express");
const router = express.Router();

const {checkout} = require("../controllers/checkoutController.cjs");
const authenticate = require("../middleware/authenticate.cjs");

console.log("authenticate:", authenticate);
console.log("checkout:", checkout);
router.post("/:userId", authenticate, checkout);


module.exports = router;