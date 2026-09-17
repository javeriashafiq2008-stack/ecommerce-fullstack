const sequelize = require('./config/db_config.cjs');
const Product = require('./models/productModel.cjs');

async function resetAndSyncDatabase() {
  try {
    console.log("Connecting to Aiven MySQL...");
    await sequelize.authenticate();
    console.log("Database connection successful!");

    // 1. Existing table ko safe side par drop karein taake old mismatched columns remove ho jayein
    await sequelize.query("DROP TABLE IF EXISTS products;");
    console.log("Old products table dropped.");

    // 2. Model ke exact attributes (id UUID, title, price, description, images, image_url, etc.) ke sath fresh table create karein
    await sequelize.sync({ force: true });
    console.log("Fresh products table created with all required columns!");

    // 3. (Optional) Single sample product insert karein test karne ke liye
    await Product.create({
      title: "Sample Leather Jacket",
      price: 99.99,
      description: "High quality premium leather jacket",
      imageUrl: "https://via.placeholder.com/300",
      images: ["https://via.placeholder.com/300", "https://via.placeholder.com/300"],
      category: "Clothing",
      stock: 10,
      vendor_id: "123e4567-e89b-12d3-a456-426614174000" // Valid UUID string
    });
    console.log("Sample product inserted successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Database reset failed:", error.message);
    process.exit(1);
  }
}

resetAndSyncDatabase();