const User = require("./userModel.cjs");
const Product = require("./productModel.cjs");
const Cart = require("./cartModel.cjs");
const CartItem = require("./cartitemModel.cjs");
const Order = require("./orderModel.cjs");
const OrderItem = require("./orderitemModel.cjs");

// ==========================================
// 1. User <-> Product (Vendor Relationship)
// ==========================================
User.hasMany(Product, {
    foreignKey: "vendorId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Product.belongsTo(User, {
    foreignKey: "vendorId",
    as: "Vendor",
});

// ==========================================
// 2. User <-> Cart Relationship
// ==========================================
User.hasOne(Cart, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Cart.belongsTo(User, {
    foreignKey: "userId",
});

// ==========================================
// 3. Cart <-> CartItem Relationship
// ==========================================
Cart.hasMany(CartItem, {
    foreignKey: "cartId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

CartItem.belongsTo(Cart, {
    foreignKey: "cartId",
});

// ==========================================
// 4. Product <-> CartItem Relationship
// ==========================================
Product.hasMany(CartItem, {
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

CartItem.belongsTo(Product, {
    foreignKey: "productId",
});

// ==========================================
// 5. User <-> Order Relationship
// ==========================================
User.hasMany(Order, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Order.belongsTo(User, {
    foreignKey: "userId",
});

// ==========================================
// 6. Order <-> OrderItem Relationship
// ==========================================
Order.hasMany(OrderItem, {
    foreignKey: "orderId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

OrderItem.belongsTo(Order, {
    foreignKey: "orderId",
});

// ==========================================
// 7. Product <-> OrderItem Relationship
// ==========================================
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