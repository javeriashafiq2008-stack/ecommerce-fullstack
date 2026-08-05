const { Op } = require("sequelize");
const Product = require("../models/productModel.cjs");
const User = require("../models/userModel.cjs");

require("../models/association.cjs");

const getAllProducts = async (req, res) => {
  try {
    const { search, minPrice, maxPrice } = req.query;
    const whereConditions = {};

    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (minPrice || maxPrice) {
      whereConditions.price = {};
      if (minPrice) whereConditions.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereConditions.price[Op.lte] = parseFloat(maxPrice);
    }

    const products = await Product.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: "Vendor",
          attributes: ["id", "name", "profileImage"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: User,
          as: "Vendor",
          attributes: ["id", "name", "profileImage"],
        },
      ],
    });

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
  getProductDetails,
};
