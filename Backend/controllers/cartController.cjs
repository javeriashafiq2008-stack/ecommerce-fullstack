const { Cart, CartItem, Product } = require('../models/association.cjs');

// 1. ADD TO CART / UPDATE QUANTITY
const addToCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User authentication required."
            });
        }

        // Dynamically handle both productId and product_id, as well as quantity and qty
        const productId = req.body.productId || req.body.product_id;
        const rawQuantity = req.body.quantity != null ? req.body.quantity : req.body.qty;
        const quantity = parseInt(rawQuantity, 10);

        if (!productId || isNaN(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid product or quantity."
            });
        }

        // Prevent MySQL Foreign Key Constraint errors by checking if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        // Find or create cart safely for user
        let [cart] = await Cart.findOrCreate({
            where: { userId },
            defaults: { userId }
        });

        let cartItem = await CartItem.findOne({
            where: { cartId: cart.id, productId }
        });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({
                cartId: cart.id,
                productId,
                quantity
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
        console.error("API Error in addToCart:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// 2. GET USER CART
const getCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User authentication required."
            });
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
        console.error("API Error in getCart:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// 3. UPDATE CART ITEM QUANTITY
const updateCartItem = async (req, res) => {
    try {
        const cartItemId = req.body.cartItemId || req.body.cart_item_id || req.body.id;
        const rawQuantity = req.body.quantity != null ? req.body.quantity : req.body.qty;
        const quantity = parseInt(rawQuantity, 10);

        if (!cartItemId || isNaN(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid cart item or quantity."
            });
        }

        const cartItem = await CartItem.findByPk(cartItemId);

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found."
            });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        const updatedCart = await CartItem.findAll({
            where: { cartId: cartItem.cartId },
            include: [{ model: Product }]
        });

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully.",
            cart: updatedCart
        });

    } catch (error) {
        console.error("API Error in updateCartItem:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// 4. REMOVE ITEM FROM CART
const removeFromCart = async (req, res) => {
    try {
        const { cartItemId } = req.params;

        if (!cartItemId) {
            return res.status(400).json({
                success: false,
                message: "Cart Item ID required."
            });
        }

        const item = await CartItem.findByPk(cartItemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart."
            });
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
        console.error("API Error in removeFromCart:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart
};