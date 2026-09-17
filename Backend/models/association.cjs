const User = require("./userModel.cjs");
const Product = require("./productModel.cjs");
const Cart = require("./cartModel.cjs");
const CartItem = require("./cartitemModel.cjs");
const Order = require("./orderModel.cjs");
const OrderItem = require("./orderitemModel.cjs");

User.hasMany(Product, {
  foreignKey: { name: "vendor_id", field: "vendor_id" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsTo(User, {
  foreignKey: { name: "vendor_id", field: "vendor_id" },
  as: "Vendor",
});

User.hasOne(Cart, {
  foreignKey: { name: "userId", field: "user_id" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Cart.belongsTo(User, {
  foreignKey: { name: "userId", field: "user_id" },
});

Cart.hasMany(CartItem, {
  foreignKey: { name: "cartId", field: "cart_id" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

CartItem.belongsTo(Cart, {
  foreignKey: { name: "cartId", field: "cart_id" },
});

Product.hasMany(CartItem, {
  foreignKey: { name: "productId", field: "product_id" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

CartItem.belongsTo(Product, {
  foreignKey: { name: "productId", field: "product_id" },
});

User.hasMany(Order, {
  foreignKey: { name: "userId", field: "user_id" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Order.belongsTo(User, {
  foreignKey: { name: "userId", field: "user_id" },
});

Order.hasMany(OrderItem, {
  foreignKey: { name: "orderId", field: "order_id" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

OrderItem.belongsTo(Order, {
  foreignKey: { name: "orderId", field: "order_id" },
});

Product.hasMany(OrderItem, {
  foreignKey: { name: "productId", field: "product_id" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

OrderItem.belongsTo(Product, {
  foreignKey: { name: "productId", field: "product_id" },
});

module.exports = {
  User,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
};
