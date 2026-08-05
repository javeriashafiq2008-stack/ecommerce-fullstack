const { User, Product, Order, OrderItem } = require("../models/association.cjs");
const sequelize = require("../config/db_config.cjs");
const Cart = require("../models/cartModel.cjs");
const CartItem = require("../models/cartitemModel.cjs");

const checkout = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { paymentMethod, shippingAddress } = req.body;

    if (!paymentMethod) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Payment method is required.",
      });
    }

    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required.",
      });
    }

    const cart = await Cart.findOne({
      where: { userId },
      transaction,
    });

    if (!cart) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [{ model: Product }],
      transaction,
    });

    if (cartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Cart is empty.",
      });
    }

    const order = await Order.create(
      {
        userId,
        totalAmount: 0,
        paymentMethod,
        shippingAddress,
        paymentStatus: "Paid",
        orderStatus: "Pending",
      },
      { transaction }
    );

    let total = 0;

    for (const item of cartItems) {
      if (!item.Product) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      const price = Number(item.Product.price);
      const quantity = item.quantity;

      total += price * quantity;

      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.productId,
          quantity,
          price,
        },
        { transaction }
      );

      const newStock = Math.max(0, (item.Product.stock ?? 0) - quantity);
      await item.Product.update({ stock: newStock }, { transaction });
    }

    await order.update({ totalAmount: total }, { transaction });

    await CartItem.destroy({
      where: { cartId: cart.id },
      transaction,
    });

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Checkout successful.",
      order,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Checkout Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { checkout, getMyOrders };
