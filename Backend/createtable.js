const sequelize = require('./config/db_config.cjs');

// Aap ke actual files se models load ho rahe hain
require('./models/association.cjs'); 
const User = require('./models/userModel.cjs');
const Product = require('./models/productModel.cjs');
const CartItem = require('./models/cartitemModel.cjs');
const Order = require('./models/orderModel.cjs');
const OrderItem = require('./models/orderitemModel.cjs');

async function nukeAndRebuildDatabase() {
  try {
    console.log("Connecting to Aiven MySQL for FULL SCHEMA REBUILD...");
    await sequelize.authenticate();
    console.log("Database connected!");

    // 1. Foreign key constraints disable karein
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
    console.log("Foreign key checks disabled.");

    // 2. Pure Database ke Tamam Tables Sync/Force-Recreate Karein
    await sequelize.sync({ force: true });
    console.log("ALL TABLES RECREATED SUCCESSFULLY FROM SEQUELIZE MODELS!");

    // 3. Foreign key constraints enable karein
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
    console.log("Foreign key checks enabled.");

    console.log("DATABASE RESET COMPLETE - NO MORE UNKNOWN COLUMN ERRORS!");
    process.exit(0);
  } catch (error) {
    console.error("Database reset failed:", error);
    process.exit(1);
  }
}

nukeAndRebuildDatabase();