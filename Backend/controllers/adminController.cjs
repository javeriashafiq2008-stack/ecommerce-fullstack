const { Op, fn, col, literal } = require("sequelize");
const { User, Product, Order, OrderItem } = require("../models/association.cjs");
const bcrypt = require("bcryptjs");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: "buyer" } });
    const totalVendors = await User.count({ where: { role: "vendor" } });
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();

    const revenue = await Order.sum("totalAmount", {
      where: { paymentStatus: "Paid" },
    });

    const recentOrders = await Order.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    const recentProducts = await Product.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "Vendor",
          attributes: ["id", "name"],
        },
      ],
    });

    const recentUsers = await User.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalVendors,
        totalProducts,
        totalOrders,
        totalRevenue: revenue || 0,
        recentOrders: recentOrders.map((o) => ({
          id: o.id,
          customerName: o.User?.name || "—",
          total: o.totalAmount,
          status: o.orderStatus,
          createdAt: o.createdAt,
        })),
        recentProducts: recentProducts.map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          imageUrl: p.imageUrl,
          vendorName: p.Vendor?.name || "—",
          createdAt: p.createdAt,
        })),
        recentUsers: recentUsers.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (role) updates.role = role;
    if (status) updates.status = status;

    await user.update(updates);

    const safe = user.toJSON();
    delete safe.password;

    res.status(200).json({ success: true, message: "User updated", user: safe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: "Cannot delete your own account" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.destroy();
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: User,
          as: "Vendor",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await product.destroy();
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: OrderItem, include: [Product] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowed = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!allowed.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: "Invalid order status" });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, email } = req.body;
    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (req.file?.path) updates.profileImage = req.file.path;

    await user.update(updates);

    const safe = user.toJSON();
    delete safe.password;

    res.status(200).json({ success: true, message: "Profile updated", data: safe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both passwords required" });
    }

    const user = await User.findByPk(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const revenue = (await Order.sum("totalAmount", { where: { paymentStatus: "Paid" } })) || 0;
    const orders = await Order.count();
    const users = await User.count();
    const products = await Product.count();

    const monthlyRevenue = await Order.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("created_at"), "%Y-%m"), "month"],
        [fn("SUM", col("total_amount")), "revenue"],
      ],
      where: { paymentStatus: "Paid" },
      group: [literal("month")],
      order: [[literal("month"), "ASC"]],
      raw: true,
    });

    const ordersPerMonth = await Order.findAll({
      attributes: [
        [fn("DATE_FORMAT", col("created_at"), "%Y-%m"), "month"],
        [fn("COUNT", col("id")), "count"],
      ],
      group: [literal("month")],
      order: [[literal("month"), "ASC"]],
      raw: true,
    });

    const topProducts = await OrderItem.findAll({
      attributes: [
        "productId",
        [fn("SUM", col("quantity")), "sold"],
        [fn("SUM", literal("quantity * price")), "revenue"],
      ],
      include: [{ model: Product, attributes: ["id", "title", "imageUrl"] }],
      group: ["productId", "Product.id", "Product.title", "Product.image_url"],
      order: [[literal("sold"), "DESC"]],
      limit: 5,
    });

    res.status(200).json({
      success: true,
      data: {
        summary: { revenue, orders, users, products },
        monthlyRevenue,
        ordersPerMonth,
        topProducts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllProducts,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAnalytics,
};
