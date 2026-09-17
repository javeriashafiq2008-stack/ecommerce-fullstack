const sequelize = require('./config/db_config.cjs');
const Product = require('./models/productModel.cjs');

async function syncProductSchema() {
  try {
    console.log("Connecting to Aiven MySQL database...");
    await sequelize.authenticate();
    console.log("Database connection successful!");

    // 1. Missing columns (images, title, etc.) check and add manually if alter misses them
    const [columns] = await sequelize.query("DESCRIBE products;");
    const existingColumns = columns.map((col) => col.Field);

    if (!existingColumns.includes('images')) {
      console.log("Adding missing 'images' column...");
      await sequelize.query("ALTER TABLE products ADD COLUMN images LONGTEXT DEFAULT '[]';");
    }

    if (!existingColumns.includes('title') && existingColumns.includes('name')) {
      console.log("Renaming 'name' column to 'title'...");
      await sequelize.query("ALTER TABLE products CHANGE COLUMN name title VARCHAR(255) NOT NULL;");
    }

    // 2. Full Sequelize sync enforce
    await sequelize.sync({ alter: true });
    console.log("All product columns and models synced perfectly!");

    process.exit(0);
  } catch (error) {
    console.error("Schema sync failed:", error.message);
    process.exit(1);
  }
}

syncProductSchema();