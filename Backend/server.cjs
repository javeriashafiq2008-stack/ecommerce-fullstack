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
      
      // Auto-create missing tables/columns safely with foreign key checks toggled
      try {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
        await sequelize.sync({ alter: true });
      } catch (syncErr) {
        console.warn("Database sync warning:", syncErr.message);
      } finally {
        try {
          await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
        } catch (fkErr) {
          console.error("Failed to re-enable foreign key checks:", fkErr.message);
        }
      }

      isConnected = true;
      console.log("Database connected and schema synchronized successfully.");
    } catch (error) {
      console.error("Database initialization failed:", error.message);
      return res.status(500).json({ error: "Database connection failed", details: error.message });
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