const CartItem = require("../models/cartitemModel.cjs");
const Cart = require("../models/cartModel.cjs");
const Product = require("../models/productModel.cjs");
const Order = require("../models/orderModel.cjs");
const OrderItem = require("../models/orderitemModel.cjs");

const checkout = async (req, res) => {
    try {
        const { userId } = req.params;
        const { paymentMethod, shippingAddress } = req.body;

        // 1. Check required fields
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required."
            });
        }

        if (!paymentMethod || !shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Payment method and shipping address are required."
            });
        }

        // 2. Find user's cart
        const cart = await Cart.findOne({
            where: { userId }
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        // 3. Get cart items
        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id },
            include: [{ model: Product }]
        });

        if (cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty."
            });
        }

        // 4. Create order
        const order = await Order.create({
            userId,
            totalAmount: 0,
            paymentMethod,
            shippingAddress
        });

        let total = 0;

        // 5. Create order items
        for (const item of cartItems) {

            if (!item.Product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found."
                });
            }

            const price = Number(item.Product.price);
            const quantity = item.quantity;

            total += price * quantity;

            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity,
                price
            });
        }

        // 6. Update total amount
        await order.update({
            totalAmount: total
        });

        // 7. Clear cart
        await CartItem.destroy({
            where: { cartId: cart.id }
        });

        return res.status(200).json({
            success: true,
            message: "Checkout successful.",
            order
        });

    } catch (error) {
        console.error("Checkout Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { checkout };