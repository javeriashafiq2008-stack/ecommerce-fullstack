const { DataTypes } = require("sequelize");
const sequelize = require("../config/db_config.cjs");

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'id'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'title',
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
        allowNull: true, // MySQL strict mode: NO defaultValue on TEXT/LONGTEXT
        field: 'images',
        get() {
            const value = this.getDataValue("images");
            if (!value) return [];
            if (Array.isArray(value)) return value;
            try {
                return typeof value === "string" ? JSON.parse(value) : value;
            } catch {
                return [];
            }
        },
        set(value) {
            if (typeof value === "string") {
                this.setDataValue("images", value);
            } else {
                this.setDataValue("images", JSON.stringify(value || []));
            }
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
        field: 'vendor_id',
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'products',
    timestamps: true,
    underscored: true
});

// Backward-compatibility: allow accessing product.vendorId seamlessly
Object.defineProperty(Product.prototype, 'vendorId', {
    get() {
        return this.vendor_id;
    },
    set(val) {
        this.vendor_id = val;
    }
});

Object.defineProperty(Product.prototype, 'image_url', {
    get() {
        return this.imageUrl;
    },
    set(val) {
        this.imageUrl = val;
    }
});

module.exports = Product;