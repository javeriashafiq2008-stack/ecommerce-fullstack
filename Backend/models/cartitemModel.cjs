const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config.cjs');
const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cartId: {
    type: DataTypes.UUID,
    allowNull: false,
   
  },
  productId: {
    type: DataTypes.UUID, 
    allowNull: false,
    
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
}, {
  timestamps: true,
  
});

module.exports = CartItem;