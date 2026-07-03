const express = require('express');
const cors = require('cors');
const User =require("./models/userModel.cjs");
const Product =require("./models/productModel.cjs");
const authRoutes = require('./routes/authRoutes.cjs');
const vendorRoutes = require("./routes/vendorRoutes.cjs");
const catalogRoutes = require("./routes/catalogRoutes.cjs")



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use("/api/vendor", vendorRoutes );
app.use("/api/products", catalogRoutes)


app.use((req, res) => {
    res.status(404).json({ message: "Route not found." });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: "An internal server error occurred.", error: err.message });
});

module.exports = app;