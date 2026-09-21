const dotenv = require("dotenv");
dotenv.config();

require("./models/association.cjs");

const app = require("./app.cjs");
const sequelize = require("./config/db_config.cjs");

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // Auto-sync schema ONLY when explicitly enabled
    if (process.env.DB_AUTO_SYNC === "true") {
      try {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
        await sequelize.sync({ alter: true });
        console.log("Database schema synchronized successfully.");
      } catch (syncErr) {
        console.warn("Database sync warning:", syncErr.message);
      } finally {
        try {
          await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
        } catch (fkErr) {
          console.error(
            "Failed to re-enable foreign key checks:",
            fkErr.message
          );
        }
      }
    }

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  }
}

startServer();