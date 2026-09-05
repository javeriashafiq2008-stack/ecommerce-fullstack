const Product = require("../models/productModel.cjs");
const Order = require("../models/orderModel.cjs");
const OrderItem = require("../models/orderitemModel.cjs");
const User = require("../models/userModel.cjs");
require("../models/association.cjs");

// =========================
// Get Vendor Products
// =========================
const getVendorProducts = async (req, res) => {
    try {
        const vendorId = req.user.id;

        const products = await Product.findAll({
            where: { vendor_id: vendorId },
            order: [["createdAt", "DESC"]]
        });

        return res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =========================
// Create Product
// =========================
const createProduct = async (req, res) => {
    try {
        const vendorId = req.user.id;

        const {
            title,
            price,
            description,
            category,
            stock
        } = req.body;

        const filePaths = (req.files || []).map(file => file.path);

        const newProduct = await Product.create({
            title,
            price,
            description,
            category: category || null,
            stock: stock ? parseInt(stock, 10) : 0,
            imageUrl: filePaths[0] || null,
            images: filePaths,
            vendor_id: vendorId
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: newProduct
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// =========================
// Update Product
// =========================
const updateProduct = async (req, res) => {
    try {

        const vendorId = req.user.id;
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.vendor_id !== vendorId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const updates = {
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            stock: req.body.stock
        };

        if (req.files && req.files.length > 0) {

            const filePaths = req.files.map(file => file.path);

            updates.imageUrl = filePaths[0];
            updates.images = filePaths;
        }

        await product.update(updates);

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// =========================
// Delete Product
// =========================
const deleteProduct = async (req, res) => {

    try {

        const vendorId = req.user.id;
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        }

        if (product.vendor_id !== vendorId) {

            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });

        }

        await product.destroy();

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// =========================
// Vendor Orders
// =========================
const getVendorOrders = async (req, res) => {

    try {

        const vendorId = req.user.id;

        const orders = await OrderItem.findAll({

            include: [

                {
                    model: Product,
                    where: {
                        vendor_id: vendorId
                    },
                    attributes: [
                        "id",
                        "title",
                        "price",
                        "imageUrl"
                    ]
                },

                {
                    model: Order,
                    include: [
                        {
                            model: User,
                            attributes: [
                                "id",
                                "name",
                                "email"
                            ]
                        }
                    ]
                }

            ],

            order: [["createdAt", "DESC"]]

        });

        return res.status(200).json({

            success: true,
            data: orders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// =========================
// Vendor Dashboard
// =========================
const getVendorDashboardStats = async (req, res) => {

    try {

        const vendorId = req.user.id;

        const totalProducts = await Product.count({
            where: {
                vendor_id: vendorId
            }
        });

        const totalStock = await Product.sum("stock", {
            where: {
                vendor_id: vendorId
            }
        });

        const orderItems = await OrderItem.findAll({

            include: [

                {
                    model: Product,
                    where: {
                        vendor_id: vendorId
                    },
                    attributes: [
                        "price",
                        "title",
                        "imageUrl"
                    ]
                },

                {
                    model: Order,
                    include: [
                        {
                            model: User,
                            attributes: [
                                "id",
                                "name",
                                "email"
                            ]
                        }
                    ]
                }

            ],

            order: [["createdAt", "DESC"]]

        });

        const totalOrders = new Set(
            orderItems.map(item => item.orderId)
        ).size;

        const totalRevenue = orderItems.reduce(
            (sum, item) =>
                sum + (item.quantity * item.Product.price),
            0
        );

        const recentProducts = await Product.findAll({

            where: {
                vendor_id: vendorId
            },

            limit: 5,

            order: [["createdAt", "DESC"]]

        });

        const recentOrders = orderItems.slice(0, 5);

        return res.status(200).json({

            success: true,

            data: {

                totalProducts,

                totalOrders,

                totalRevenue,

                totalStock: totalStock || 0,

                recentProducts,

                recentOrders

            }

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    getVendorProducts,

    createProduct,

    updateProduct,

    deleteProduct,

    getVendorOrders,

    getVendorDashboardStats

};