const dotenv = require("dotenv");
dotenv.config();

require("./models/association.cjs");

const app = require("./app.cjs");
const sequelize = require("./config/db_config.cjs");

const port = process.env.PORT || 3000;

// Automatically sync database tables on startup (bypasses local network bottlenecks)
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database connection established and tables synchronized successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect or sync the Database:", error.message);
  });

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is working on port ${port}`);
  });
}

module.exports = app;