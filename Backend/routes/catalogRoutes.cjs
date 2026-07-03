const express = require('express');
const router = express.Router();
const { getAllProducts, getProductDetails } = require('../controllers/catalogController.cjs'); 
const  authenticate = require('../middleware/authenticate.cjs');
router.get('/', authenticate, getAllProducts);
router.get('/:id', authenticate, getProductDetails);



module.exports = router;