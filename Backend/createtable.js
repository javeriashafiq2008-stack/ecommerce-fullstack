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

async function syncDatabase() {
  try {
    console.log("Connecting to Aiven MySQL for Database Synchronization...");
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    // 1. Foreign key constraints disable karein to avoid setup collisions
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
    console.log("Foreign key checks disabled.");

    // 2. Controlled rebuild or alter sync
    const isForce = process.argv.includes('--force');
    if (isForce) {
      console.log("Running sequelize.sync({ force: true }) - Rebuilding all tables...");
      await sequelize.sync({ force: true });
    } else {
      console.log("Running sequelize.sync({ alter: true }) - Normalizing and aligning schema...");
      await sequelize.sync({ alter: true });
    }

    console.log("ALL TABLES (users, products, carts, cart_items, orders, order_items) SYNCED SUCCESSFULLY!");
  } catch (error) {
    console.error("Database sync failed:", error);
    process.exitCode = 1;
  } finally {
    // 3. Foreign key constraints enable karein (Guaranteed execution in finally block)
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

syncDatabase();