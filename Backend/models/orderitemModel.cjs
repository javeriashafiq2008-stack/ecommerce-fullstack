const { DataTypes } = require("sequelize");
const sequelize = require("../config/db_config.cjs");

const OrderItem = sequelize.define("OrderItem", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: "id",
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "order_id",
        references: {
            model: "orders", // Standardized to match lowercase table name
            key: "id",
        },
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "product_id",
        references: {
            model: "products", // Standardized to match lowercase table name
            key: "id",
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: "quantity",
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "price",
    },
}, {
    tableName: "order_items", // Explicit MySQL table name
    timestamps: true,
    underscored: true,
});

module.exports = OrderItem;