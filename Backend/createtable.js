import pool from './config/db_config.cjs'; // Apne db.js connection file ka exact path check kar lein

async function setupDatabase() {
  try {
    console.log("Connecting to Aiven MySQL and creating tables...");

    // 1. Create Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create Products Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(500),
        category VARCHAR(100),
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Insert Dummy Products
    await pool.query(`
      INSERT INTO products (name, description, price, image_url, category, stock)
      VALUES 
      ('Classic T-Shirt', 'High quality cotton t-shirt', 19.99, 'https://via.placeholder.com/150', 'Clothing', 50),
      ('Wireless Headphones', 'Noise cancelling bluetooth headphones', 89.99, 'https://via.placeholder.com/150', 'Electronics', 20)
      ON DUPLICATE KEY UPDATE id=id;
    `);

    console.log("All tables created and sample data inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();