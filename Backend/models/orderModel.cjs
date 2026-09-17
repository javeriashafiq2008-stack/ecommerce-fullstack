const { DataTypes } = require("sequelize");
const sequelize = require("../config/db_config.cjs");

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: "id",
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id",
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "total_amount",
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "payment_method",
    },
    paymentStatus: {
        type: DataTypes.ENUM("Pending", "Paid", "Failed"),
        defaultValue: "Pending",
        field: "payment_status",
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
        field: "order_status",
    },
    shippingAddress: {
        type: DataTypes.JSON,
        allowNull: false,
        field: "shipping_address",
    },
}, {
    tableName: "orders",
    timestamps: true,
    underscored: true,
});

module.exports = Order;