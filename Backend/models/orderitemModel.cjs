const { DataTypes } = require("sequelize");
const sequelize = require("../config/db_config.cjs");

const OrderItem = sequelize.define("OrderItem", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Orders",
            key: "id",
        },
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Products",
            key: "id",
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
});

module.exports = OrderItem;