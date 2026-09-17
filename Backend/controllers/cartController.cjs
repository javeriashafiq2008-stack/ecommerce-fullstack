const sequelize = require('../config/db_config.cjs');
const { Cart, CartItem, Product } = require('../models/association.cjs');

// 1. ADD TO CART / UPDATE QUANTITY (Atomic with Transaction & Row Locking)
const addToCart = async (req, res) => {
    let transaction;
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User authentication required."
            });
        }

        // Dynamically handle both productId, product_id, and id
        const productId = req.body.productId || req.body.product_id || req.body.id;
        const rawQuantity = req.body.quantity != null ? req.body.quantity : req.body.qty;
        const quantity = parseInt(rawQuantity, 10);

        if (!productId || isNaN(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid product or quantity."
            });
        }

        transaction = await sequelize.transaction();

        // Prevent MySQL Foreign Key Constraint errors by checking if product exists
        const product = await Product.findByPk(productId, { transaction });
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        // Find or create cart safely for user within transaction
        let [cart] = await Cart.findOrCreate({
            where: { userId },
            defaults: { userId },
            transaction
        });

        // Row-level lock prevents race conditions during rapid button clicking
        let cartItem = await CartItem.findOne({
            where: { cartId: cart.id, productId },
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save({ transaction });
        } else {
            cartItem = await CartItem.create({
                cartId: cart.id,
                productId,
                quantity
            }, { transaction });
        }

        await transaction.commit();

        // Always query and return the COMPLETE list of cart items with Product association
        const updatedCart = await CartItem.findAll({
            where: { cartId: cart.id },
            include: [{ model: Product }],
            order: [["createdAt", "ASC"]]
        });

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully.",
            cart: updatedCart
        });

    } catch (error) {
        if (transaction && !transaction.finished) {
            try {
                await transaction.rollback();
            } catch (rbError) {
                console.error("Rollback error:", rbError.message);
            }
        }
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
            include: [{ model: Product }],
            order: [["createdAt", "ASC"]]
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

// 3. UPDATE CART ITEM QUANTITY (Atomic with Transaction)
const updateCartItem = async (req, res) => {
    let transaction;
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User authentication required."
            });
        }

        const cartItemId = req.body.cartItemId || req.body.cart_item_id || req.body.id;
        const productId = req.body.productId || req.body.product_id;
        const rawQuantity = req.body.quantity != null ? req.body.quantity : req.body.qty;
        const quantity = parseInt(rawQuantity, 10);

        if ((!cartItemId && !productId) || isNaN(quantity)) {
            return res.status(400).json({
                success: false,
                message: "Invalid cart item or quantity."
            });
        }

        transaction = await sequelize.transaction();

        let [userCart] = await Cart.findOrCreate({
            where: { userId },
            defaults: { userId },
            transaction
        });

        let cartItem = cartItemId ? await CartItem.findByPk(cartItemId, { transaction, lock: transaction.LOCK.UPDATE }) : null;

        // Resilient fallback: lookup by productId in user's cart if cartItemId wasn't found by primary key
        if (!cartItem) {
            const targetProdId = cartItemId || productId;
            if (targetProdId) {
                cartItem = await CartItem.findOne({
                    where: { cartId: userCart.id, productId: targetProdId },
                    transaction,
                    lock: transaction.LOCK.UPDATE
                });
            }
        }

        if (!cartItem) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Cart item not found."
            });
        }

        const targetCartId = cartItem.cartId || userCart.id;

        if (quantity <= 0) {
            await cartItem.destroy({ transaction });
        } else {
            cartItem.quantity = quantity;
            await cartItem.save({ transaction });
        }

        await transaction.commit();

        const updatedCart = await CartItem.findAll({
            where: { cartId: targetCartId },
            include: [{ model: Product }],
            order: [["createdAt", "ASC"]]
        });

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully.",
            cart: updatedCart
        });

    } catch (error) {
        if (transaction && !transaction.finished) {
            try {
                await transaction.rollback();
            } catch (rbError) {
                console.error("Rollback error:", rbError.message);
            }
        }
        console.error("API Error in updateCartItem:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// 4. REMOVE ITEM FROM CART (Atomic with Transaction)
const removeFromCart = async (req, res) => {
    let transaction;
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User authentication required."
            });
        }

        const { cartItemId } = req.params;

        if (!cartItemId) {
            return res.status(400).json({
                success: false,
                message: "Cart Item ID required."
            });
        }

        transaction = await sequelize.transaction();

        let userCart = await Cart.findOne({ where: { userId }, transaction });

        let item = await CartItem.findByPk(cartItemId, { transaction });
        if (!item && userCart) {
            // Check if cartItemId was passed as a productId
            item = await CartItem.findOne({
                where: { cartId: userCart.id, productId: cartItemId },
                transaction
            });
        }

        if (item) {
            await item.destroy({ transaction });
        }

        await transaction.commit();

        const targetCartId = userCart ? userCart.id : (item ? item.cartId : null);
        const updatedCart = targetCartId ? await CartItem.findAll({
            where: { cartId: targetCartId },
            include: [{ model: Product }],
            order: [["createdAt", "ASC"]]
        }) : [];

        return res.status(200).json({
            success: true,
            message: "Item removed from cart.",
            cart: updatedCart
        });

    } catch (error) {
        if (transaction && !transaction.finished) {
            try {
                await transaction.rollback();
            } catch (rbError) {
                console.error("Rollback error:", rbError.message);
            }
        }
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