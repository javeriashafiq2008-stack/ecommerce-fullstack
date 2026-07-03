
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db_config.cjs");
const User  = require("./userModel.cjs");

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
    
    vendor_id: {
    type: DataTypes.UUID,
    allowNull: false,
    
}
}, {
    timestamps: true,
    underscored: true
   
});



Product.belongsTo(User, {
    foreignKey: "vendor_id"
});

User.hasMany(Product, {
    foreignKey: "vendor_id"
});


module.exports = Product;