const { DataTypes } = require("sequelize");
const sequelize = require("../config/db_config.cjs");

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
}, {
    timestamps: true,
    underscored: true 
});

module.exports = Cart;