const dotenv = require("dotenv");
dotenv.config();

require("./models/association.cjs");

const app = require("./app.cjs");
const sequelize = require("./config/db_config.cjs");

const port = process.env.PORT || 3000;

// Track connection state across serverless invocations
let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await sequelize.authenticate();
      
      // Auto-create missing tables (e.g., products) in Aiven MySQL defaultdb
      await sequelize.sync({ alter: true });
      
      isConnected = true;
      console.log("Database connected and missing tables synchronized.");
    } catch (error) {
      console.error("Database initialization failed:", error.message);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});

// Local development server listener
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;