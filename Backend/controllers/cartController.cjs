
const { Cart, CartItem, Product } = require('../models/association.cjs');
// 1. ADD TO CART / UPDATE QUANTITY
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        
        let cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            cart = await Cart.create({ userId });
        }

        let cartItem = await CartItem.findOne({
            where: { cartId: cart.id, productId }
        });

        if (cartItem) {
            cartItem.quantity += parseInt(quantity);
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({
                cartId: cart.id,
                productId,
                quantity: parseInt(quantity)
            });
        }

        const updatedCart = await CartItem.findAll({
            where: { cartId: cart.id },
            include: [{ model: Product }]
        });

        return res.status(200).json({
            success: true,
            message: "Cart updated dynamically successfully.",
            cart: updatedCart
        });

    } catch (error) {
        console.error("Error in addToCart:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// 2. GET USER CART
const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required." });
        }

        const cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            return res.status(200).json({ success: true, cart: [] });
        }

        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id },
            include: [{ model: Product }]
        });

        return res.status(200).json({ success: true, cart: cartItems });

    } catch (error) {
        console.error("Error in getCart:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// 3. REMOVE ITEM FROM CART
const removeFromCart = async (req, res) => {
    try {
        const { cartItemId } = req.body;

        if (!cartItemId) {
            return res.status(400).json({ success: false, message: "Cart Item ID required." });
        }

        const item = await CartItem.findByPk(cartItemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found in cart." });
        }

        const currentCartId = item.cartId; // Capture reference before database drop
        await item.destroy();

        // Regenerate current updated cart structure
        const updatedCart = await CartItem.findAll({
            where: { cartId: currentCartId },
            include: [{ model: Product }]
        });

        return res.status(200).json({
            success: true,
            message: "Item removed from cart.",
            cart: updatedCart
        });

    } catch (error) {
        console.error("Error in removeFromCart:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart
};