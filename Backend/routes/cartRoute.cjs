const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCart,
    removeFromCart,
    updateCartItem
} = require("../controllers/cartController.cjs");
const authenticate = require("../middleware/authenticate.cjs");

// Standard and alias endpoints for adding to cart
router.post("/addtocart", authenticate, addToCart);
router.post("/add", authenticate, addToCart);
router.post("/", authenticate, addToCart);

router.get("/", authenticate, getCart);
router.patch("/update", authenticate, updateCartItem);
router.put("/update", authenticate, updateCartItem);
router.post("/update", authenticate, updateCartItem);

router.delete("/remove/:cartItemId", authenticate, removeFromCart);
router.delete("/:cartItemId", authenticate, removeFromCart);
router.delete("/", authenticate, removeFromCart);

module.exports = router;