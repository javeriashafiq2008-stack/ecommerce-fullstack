const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2'); // Explicitly import mysql2
require('dotenv').config();

// Determine SSL options:
// - Aiven MySQL requires SSL.
// - In production or when connecting to a remote host (e.g. Aiven), SSL is enabled by default.
// - Supports Aiven CA certificate if provided via DB_CA_CERT, otherwise falls back to rejectUnauthorized: false.
// - Allows DB_SSL='false' to explicitly disable SSL for local development.
const isLocal =
  !process.env.DB_HOST ||
  process.env.DB_HOST === 'localhost' ||
  process.env.DB_HOST === '127.0.0.1';

const enableSSL =
  process.env.DB_SSL !== undefined
    ? process.env.DB_SSL === 'true'
    : !isLocal || process.env.NODE_ENV === 'production';

const sslConfig = enableSSL
  ? {
      rejectUnauthorized: process.env.DB_REJECT_UNAUTHORIZED === 'true',
      ...(process.env.DB_CA_CERT ? { ca: process.env.DB_CA_CERT } : {}),
    }
  : false;

// Connection pooling & dialect configuration optimized for Vercel serverless environments
const connectionConfig = {
  dialect: 'mysql',
  dialectModule: mysql2, // Prevents Vercel's bundler from dropping mysql2
  dialectOptions: {
    ...(sslConfig ? { ssl: sslConfig } : {}),
    connectTimeout: 30000,
  },
  // Pool settings for serverless:
  // - Low max connections prevents exhausting Aiven connection pool limits across concurrent lambdas.
  // - min: 0 allows idle connections to close completely.
  // - idle ensures connections idle longer than 10s are pruned without keeping active timers.
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '2', 10),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
};

// Initialize Sequelize: Supports either full DATABASE_URL or individual credentials
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, connectionConfig)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '17907', 10),
        ...connectionConfig,
      }
    );

module.exports = sequelize;