const { DataTypes } = require("sequelize");
const sequelize = require("../config/db_config.cjs");

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'title', // Explicitly map to MySQL 'title' column
        validate: {
            notEmpty: true
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'price',
        validate: {
            isDecimal: true,
            min: 0.01
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'description'
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'image_url'
    },
    images: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
        defaultValue: "[]",
        field: 'images',
        get() {
            const value = this.getDataValue("images");
            if (!value) return [];
            try {
                return JSON.parse(value);
            } catch {
                return [];
            }
        },
        set(value) {
            this.setDataValue("images", JSON.stringify(value || []));
        }
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'category'
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'stock',
        validate: { min: 0 }
    },
    vendor_id: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'vendor_id'
    }
}, {
    tableName: 'products', // Table name explicit set karein
    timestamps: true,
    underscored: true
});

module.exports = Product;