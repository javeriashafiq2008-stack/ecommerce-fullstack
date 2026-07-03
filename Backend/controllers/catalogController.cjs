const { Op } = require('sequelize');
const Product = require("../models/productModel.cjs");

// 1. GET ALL PRODUCTS / SEARCH & FILTER (Combined Dynamic Endpoint)
const getAllProducts = async (req, res) => {
    try {
        const { search, minPrice, maxPrice } = req.query;
        const whereConditions = {};

        // A. SEARCH LOGIC (Matches title or description)
        if (search) {
            whereConditions[Op.or] = [
                { title: { [Op.like]: `%${search}%` } }, 
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        // B. PRICE FILTER LOGIC
        if (minPrice || maxPrice) {
            whereConditions.price = {};
            if (minPrice) whereConditions.price[Op.gte] = parseFloat(minPrice); // >= 
            if (maxPrice) whereConditions.price[Op.lte] = parseFloat(maxPrice); // <= 
        }

        const products = await Product.findAll({
            where: whereConditions,
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 2. GET SINGLE PRODUCT DETAILS
const getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({ success: true, data: product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductDetails
};