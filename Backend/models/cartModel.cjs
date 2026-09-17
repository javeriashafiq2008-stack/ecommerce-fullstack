const { DataTypes } = require("sequelize");
const sequelize = require("../config/db_config.cjs");

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: "id"
    }
}, {
    tableName: 'carts', // Explicit MySQL table name
    timestamps: true,
    underscored: true // Ensure created_at & updated_at columns are used
});

module.exports = Cart;