const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCart,
    removeFromCart,
    updateCartItem
} = require("../controllers/cartController.cjs");
const authenticate = require("../middleware/authenticate.cjs");

router.post("/addtocart", authenticate, addToCart);

router.get("/", authenticate, getCart);
router.patch("/update", authenticate, updateCartItem);

router.delete("/remove/:cartItemId", authenticate, removeFromCart);



module.exports = router;