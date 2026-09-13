const dotenv = require("dotenv");
dotenv.config();

require("./models/association.cjs");

const app = require("./app.cjs");
const sequelize = require("./config/db_config.cjs");

const port = process.env.PORT || 3000;

let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await sequelize.authenticate();
      
      // Temporarily sync tables on live environment
      await sequelize.sync({ alter: true });
      
      isConnected = true;
      console.log("Database connected and tables synced successfully.");
    } catch (error) {
      console.error("Unable to connect to the Database:", error.message);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
});

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is working on port ${port}`);
  });
}

module.exports = app;