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
        validate: {
            notEmpty: true
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0.01
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    imageUrl: {
        type: DataTypes.STRING,
        allowNull: null,
    },
images: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
    defaultValue: "[]",

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
    },

    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
    },

    vendor_id: {
        type: DataTypes.UUID,
        allowNull: false,
    }
}, {
    timestamps: true,
    underscored: true
});

module.exports = Product;