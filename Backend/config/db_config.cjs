const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2'); // Explicitly import mysql2
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 17907,
    dialect: 'mysql',
    dialectModule: mysql2, // Prevents Vercel's bundler from dropping mysql2
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
);

module.exports = sequelize;