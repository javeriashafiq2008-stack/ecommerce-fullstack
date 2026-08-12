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

// Authenticate database connection on server start
(async () => {
  try {
    await sequelize.authenticate();
  
    await sequelize.sync(); 
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the Database:", error);
  }
})();


if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is working on port ${port}`);
  });
}

module.exports = app;