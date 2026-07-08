const { DataTypes } = require("sequelize");
const sequelize = require("../config/db_config.cjs");

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    paymentStatus: {
        type: DataTypes.ENUM("Pending", "Paid", "Failed"),
        defaultValue: "Pending",
    },
    orderStatus: {
        type: DataTypes.ENUM(
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ),
        defaultValue: "Pending",
    },
    shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

module.exports = Order;