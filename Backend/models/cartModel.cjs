const { DataTypes } = require("sequelize");
const sequelize = require("../config/db_config.cjs");

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: "id"
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id",
        references: {
            model: "users",
            key: "id",
        },
    }
}, {
    tableName: 'carts', // Explicit MySQL table name
    timestamps: true,
    underscored: true // Ensure created_at & updated_at columns are used
});

// Backward-compatibility: allow accessing cart.user_id seamlessly
Object.defineProperty(Cart.prototype, 'user_id', {
    get() {
        return this.userId;
    },
    set(val) {
        this.userId = val;
    }
});

module.exports = Cart;