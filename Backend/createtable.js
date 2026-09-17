const bcrypt = require('bcryptjs');
const sequelize = require('./config/db_config.cjs');

// Safely import all models and associations
const {
  User,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
} = require('./models/association.cjs');

// Stable UUIDs for seed records to guarantee database-to-frontend synchronization
const SEED_VENDOR_ID = "d0a1f2b3-c4d5-4e6f-8a9b-0c1d2e3f4b01";
const SEED_BUYER_ID = "d0a1f2b3-c4d5-4e6f-8a9b-0c1d2e3f4b02";
const SEED_ADMIN_ID = "d0a1f2b3-c4d5-4e6f-8a9b-0c1d2e3f4b03";

const SEED_PRODUCTS = [
  {
    id: "e0a1f2b3-c4d5-4e6f-8a9b-0c1d2e3f4a01",
    title: "Minimalist Wireless Headphones",
    price: 89.99,
    category: "Electronics",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    images: JSON.stringify(["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"]),
    description: "Premium noise-canceling over-ear headphones with 30-hour battery life and ultra-comfortable memory foam earcups.",
    vendor_id: SEED_VENDOR_ID,
  },
  {
    id: "e0a1f2b3-c4d5-4e6f-8a9b-0c1d2e3f4a02",
    title: "Smart Fitness Watch v2",
    price: 49.50,
    category: "Electronics",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    images: JSON.stringify(["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"]),
    description: "Track your daily activity, heart rate, and sleep quality. Features a crisp AMOLED display and 5 ATM water resistance.",
    vendor_id: SEED_VENDOR_ID,
  },
  {
    id: "e0a1f2b3-c4d5-4e6f-8a9b-0c1d2e3f4a03",
    title: "Ergonomic Mechanical Keyboard",
    price: 119.00,
    category: "Accessories",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    images: JSON.stringify(["https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"]),
    description: "Compact 75% wireless mechanical keyboard featuring customizable RGB backlighting and hot-swappable tactile switches.",
    vendor_id: SEED_VENDOR_ID,
  },
  {
    id: "e0a1f2b3-c4d5-4e6f-8a9b-0c1d2e3f4a04",
    title: "Classic Leather Daily Journal",
    price: 24.99,
    category: "Stationery",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    images: JSON.stringify(["https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"]),
    description: "Handcrafted genuine leather notebook with 240 thick, bleed-resistant cream pages. Perfect for daily planning and notes.",
    vendor_id: SEED_VENDOR_ID,
  },
  {
    id: "e0a1f2b3-c4d5-4e6f-8a9b-0c1d2e3f4a05",
    title: "Wireless Ergonomic Mouse",
    price: 34.99,
    category: "Accessories",
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    images: JSON.stringify(["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80"]),
    description: "Designed to reduce wrist strain with adjustable DPI tracking and quiet click buttons for silent work environments.",
    vendor_id: SEED_VENDOR_ID,
  },
  {
    id: "e0a1f2b3-c4d5-4e6f-8a9b-0c1d2e3f4a06",
    title: "Portable Bluetooth Speaker",
    price: 59.99,
    category: "Electronics",
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    images: JSON.stringify(["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80"]),
    description: "Waterproof IPX7 outdoor speaker delivering punchy bass, 360-degree sound, and up to 12 hours of playtime.",
    vendor_id: SEED_VENDOR_ID,
  },
  {
    id: "e0a1f2b3-c4d5-4e6f-8a9b-0c1d2e3f4a07",
    title: "Aluminum Laptop Stand",
    price: 29.99,
    category: "Accessories",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    images: JSON.stringify(["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"]),
    description: "Ventilated, fold-flat laptop cooling riser supporting 10-inch to 17-inch devices with non-slip silicone pads.",
    vendor_id: SEED_VENDOR_ID,
  },
  {
    id: "e0a1f2b3-c4d5-4e6f-8a9b-0c1d2e3f4a08",
    title: "Ceramic Coffee Mug with Lid",
    price: 18.50,
    category: "Home & Kitchen",
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    images: JSON.stringify(["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"]),
    description: "Matte finish 400ml ceramic mug with a splash-proof bamboo lid and heat-resistant silicone coaster ring.",
    vendor_id: SEED_VENDOR_ID,
  },
  {
    id: "e0a1f2b3-c4d5-4e6f-8a9b-0c1d2e3f4a09",
    title: "Minimalist Urban Backpack",
    price: 65.00,
    category: "Fashion",
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    images: JSON.stringify(["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"]),
    description: "Water-resistant canvas daypack with a padded 15.6-inch laptop compartment and hidden anti-theft back pocket.",
    vendor_id: SEED_VENDOR_ID,
  },
  {
    id: "e0a1f2b3-c4d5-4e6f-8a9b-0c1d2e3f4a10",
    title: "Stainless Steel Water Bottle",
    price: 21.99,
    category: "Home & Kitchen",
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    images: JSON.stringify(["https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80"]),
    description: "Double-wall vacuum insulated flask keeping drinks cold for 24 hours or hot for 12 hours without sweating.",
    vendor_id: SEED_VENDOR_ID,
  },
  {
    id: "e0a1f2b3-c4d5-4e6f-8a9b-0c1d2e3f4a11",
    title: "LED Desk Lamp with Wireless Charger",
    price: 39.99,
    category: "Home & Kitchen",
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=800&q=80",
    images: JSON.stringify(["https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=800&q=80"]),
    description: "Dimmable eye-caring table lamp featuring 5 brightness levels, 3 color modes, and an integrated Qi charging pad.",
    vendor_id: SEED_VENDOR_ID,
  },
  {
    id: "e0a1f2b3-c4d5-4e6f-8a9b-0c1d2e3f4a12",
    title: "Retro Polarized Sunglasses",
    price: 27.50,
    category: "Fashion",
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    images: JSON.stringify(["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"]),
    description: "UV400 protection polarized lenses with lightweight acetate frames for daily outdoor style.",
    vendor_id: SEED_VENDOR_ID,
  },
];

async function syncAndSeedDatabase() {
  try {
    console.log("Connecting to Aiven MySQL for Database Synchronization & Seeding...");
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    // 1. Disable foreign key constraints during setup
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
    console.log("Foreign key checks disabled.");

    // 2. Synchronize schema
    const isForce = process.argv.includes('--force');
    if (isForce) {
      console.log("Running sequelize.sync({ force: true }) - Rebuilding all tables...");
      await sequelize.sync({ force: true });
    } else {
      console.log("Running sequelize.sync({ alter: true }) - Aligning schema...");
      await sequelize.sync({ alter: true });
    }

    console.log("Tables synchronized successfully.");

    // 3. Seed Users (Vendor, Buyer, Admin)
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash("Password123!", salt);

    const [vendor] = await User.findOrCreate({
      where: { email: "vendor@jaydor.com" },
      defaults: {
        id: SEED_VENDOR_ID,
        name: "Jaydor Official Store",
        email: "vendor@jaydor.com",
        password: defaultPasswordHash,
        role: "vendor",
        status: "active",
      },
    });
    console.log(`Seed Vendor verified: ${vendor.name} (${vendor.id})`);

    const [buyer] = await User.findOrCreate({
      where: { email: "buyer@jaydor.com" },
      defaults: {
        id: SEED_BUYER_ID,
        name: "Demo Buyer",
        email: "buyer@jaydor.com",
        password: defaultPasswordHash,
        role: "buyer",
        status: "active",
      },
    });
    console.log(`Seed Buyer verified: ${buyer.name} (${buyer.id})`);

    const [admin] = await User.findOrCreate({
      where: { email: "admin@jaydor.com" },
      defaults: {
        id: SEED_ADMIN_ID,
        name: "Jaydor Admin",
        email: "admin@jaydor.com",
        password: defaultPasswordHash,
        role: "admin",
        status: "active",
      },
    });
    console.log(`Seed Admin verified: ${admin.name} (${admin.id})`);

    // 4. Seed Products with real UUIDs linked to the verified vendor
    console.log(`Seeding ${SEED_PRODUCTS.length} production-ready products with valid UUIDs...`);
    for (const prodData of SEED_PRODUCTS) {
      await Product.findOrCreate({
        where: { id: prodData.id },
        defaults: {
          ...prodData,
          vendor_id: vendor.id,
        },
      });
    }

    const count = await Product.count();
    console.log(`ALL TABLES READY! Total products in database: ${count}`);

  } catch (error) {
    console.error("Database sync & seed failed:", error);
    process.exitCode = 1;
  } finally {
    // 5. Always re-enable foreign key constraints in finally block
    try {
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
      console.log("Foreign key checks re-enabled.");
    } catch (fkError) {
      console.error("Failed to re-enable foreign key checks:", fkError.message);
    }

    try {
      await sequelize.close();
      console.log("Database connection closed.");
    } catch (closeErr) {
      console.error("Error closing connection:", closeErr.message);
    }
  }
}

// Allow importing seeds or direct execution
module.exports = {
  SEED_VENDOR_ID,
  SEED_BUYER_ID,
  SEED_ADMIN_ID,
  SEED_PRODUCTS,
  syncAndSeedDatabase,
};

if (require.main === module) {
  syncAndSeedDatabase();
}