const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config.cjs');

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'id',
  },
  cartId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'cart_id',
    references: {
      model: 'carts',
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'product_id',
    references: {
      model: 'products',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'quantity',
    validate: {
      min: 1,
    },
  },
}, {
  tableName: 'cart_items', // Explicit MySQL table name
  timestamps: true,
  underscored: true, // Ensures created_at & updated_at columns are used
});

module.exports = CartItem;