const sequelize = require('./config/db_config.cjs');

async function fixDatabaseSchema() {
  try {
    console.log("Connecting to Aiven MySQL database...");
    await sequelize.authenticate();

    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
    await sequelize.query("DROP TABLE IF EXISTS products;");

    // LONGTEXT ki bajaye JSON type use karein
    await sequelize.query(`
      CREATE TABLE products (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        images JSON NULL,
        category VARCHAR(100),
        stock INT NOT NULL DEFAULT 0,
        vendor_id VARCHAR(36) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
    console.log("Fresh 'products' table created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Schema fix failed:", error);
    process.exit(1);
  }
}

fixDatabaseSchema();