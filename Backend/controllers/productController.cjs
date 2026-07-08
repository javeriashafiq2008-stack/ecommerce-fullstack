const Product = require("../models/productModel.cjs");

const getVendorProducts = async (req, res) => {
    try {
        const vendorId = req.user.id; 

        const products = await Product.findAll({
            where: { vendor_id: vendorId }
        });

        return res.status(200).json({ success: true, data: products });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
const createProduct = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const { title, price, description } = req.body;

        const imageUrl = req.file ? req.file.path : null;

        const newProduct = await Product.create({
            title,
            price,
            description,
            imageUrl,
            vendor_id: vendorId
        });

        return res.status(201).json({
            success: true,
            data: newProduct
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const { id } = req.params; 
        const { title, price, description } = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.vendor_id !== vendorId) {
            return res.status(403).json({ success: false, message: "Unauthorized to edit this product" });
        }

        await product.update({ title, price, description });

        return res.status(200).json({ success: true, message: "Product updated successfully", data: product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.vendor_id !== vendorId) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this product" });
        }

        await product.destroy();

        return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getVendorProducts,
    createProduct,
    updateProduct,
    deleteProduct
};