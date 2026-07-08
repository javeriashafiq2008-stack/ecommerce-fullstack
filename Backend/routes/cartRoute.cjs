const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCart,
    removeFromCart
} = require("../controllers/cartController.cjs");
const authenticate = require("../middleware/authenticate.cjs");

router.post("/addtocart", authenticate, addToCart);

router.get("/", authenticate, getCart);

router.delete("/remove/:cartItemId", authenticate, removeFromCart);



module.exports = router;