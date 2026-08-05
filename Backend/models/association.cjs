const User = require("./userModel.cjs");
const Product = require("./productModel.cjs");
const Cart = require("./cartModel.cjs");
const CartItem = require("./cartitemModel.cjs");
const Order = require("./orderModel.cjs");
const OrderItem = require("./orderitemModel.cjs");

User.hasMany(Product, {
  foreignKey: "vendor_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsTo(User, {
  foreignKey: "vendor_id",
  as: "Vendor",
});

User.hasOne(Cart, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Cart.belongsTo(User, {
  foreignKey: "userId",
});

Cart.hasMany(CartItem, {
  foreignKey: "cartId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

CartItem.belongsTo(Cart, {
  foreignKey: "cartId",
});

Product.hasMany(CartItem, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

CartItem.belongsTo(Product, {
  foreignKey: "productId",
});

User.hasMany(Order, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Order.belongsTo(User, {
  foreignKey: "userId",
});

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
});

Product.hasMany(OrderItem, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

OrderItem.belongsTo(Product, {
  foreignKey: "productId",
});

module.exports = {
  User,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
};
