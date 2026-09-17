const { DataTypes } = require("sequelize");
const sequelize = require("../config/db_config.cjs");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "id",
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "name",
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "email",
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password",
    },

    role: {
      type: DataTypes.ENUM("buyer", "vendor", "admin"),
      allowNull: false,
      defaultValue: "buyer",
      field: "role",
    },

    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "profile_image", // Maps profileImage JS property to profile_image column in MySQL
    },

    status: {
      type: DataTypes.ENUM("active", "suspended"),
      allowNull: false,
      defaultValue: "active",
      field: "status",
    },
  },
  {
    tableName: "users", // Explicitly sets table name in Aiven MySQL
    timestamps: true,
    underscored: true,  // Automatically uses created_at and updated_at
  }
);

module.exports = User;