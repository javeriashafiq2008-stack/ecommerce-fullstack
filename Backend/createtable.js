const sequelize = require('./config/db_config.cjs');

async function setupDatabase() {
  try {
    console.log("Connecting to Aiven MySQL and fixing schema...");

    // 1. Rename 'name' column to 'title' if it exists in raw products table
    try {
      await sequelize.query(`
        ALTER TABLE products CHANGE COLUMN name title VARCHAR(255) NOT NULL;
      `);
      console.log("Renamed 'name' column to 'title'.");
    } catch (e) {
      console.log("Column 'title' already aligned or table recreated.");
    }

    // 2. Sync Sequelize models with Aiven MySQL DB
    await sequelize.sync({ alter: true });
    console.log("Sequelize models synchronized successfully!");

    console.log("Database setup complete!");
    process.exit(0);
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();