const express = require('express');
const cors = require('cors');
const User =require("./models/userModel.cjs");
const Product =require("./models/productModel.cjs");
const Cart = require("./models/cartModel.cjs");
const CartItem = require("./models/cartitemModel.cjs")
const authRoute = require('./routes/authRoute.cjs');
const vendorRoute = require("./routes/vendorRoute.cjs");
const catalogRoute = require("./routes/catalogRoute.cjs");
const cartRoute =require("./routes/cartRoute.cjs");
const checkoutRoute = require("./routes/orderRoute.cjs");
const adminRoute=require("./routes/adminRoute.cjs")



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoute);
app.use("/api/vendor", vendorRoute );
app.use("/api/products", catalogRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout" , checkoutRoute);
app.use("/api/admin" , adminRoute)




app.use((req, res) => {
    res.status(404).json({ message: "Route not found." });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: "An internal server error occurred.", error: err.message });
});

module.exports = app;