const dotenv = require("dotenv");
dotenv.config();

require("./models/association.cjs");

const app = require("./app.cjs");
const sequelize = require("./config/db_config.cjs");

const port = process.env.PORT || 3000;

// Root health check route
app.get("/", (req, res) => {
  res.send("Ecommerce API is running successfully!");
});

// Non-blocking database authentication (No sequelize.sync)
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the Database:", error.message);
  });

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is working on port ${port}`);
  });
}

module.exports = app;