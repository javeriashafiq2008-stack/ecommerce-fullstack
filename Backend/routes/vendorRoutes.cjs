const express = require('express');
const router = express.Router();
const {  getVendorProducts, updateProduct, deleteProduct , createProduct} = require('../controllers/productController.cjs');
const authorize = require('../middleware/authorize.cjs');
const  authenticate  = require('../middleware/authenticate.cjs');

router.post('/add', authenticate, authorize('vendor'), createProduct);
router.get('/vendor/all',  authenticate, authorize('vendor'), getVendorProducts);
router.put('/update/:id',  authenticate,authorize('vendor'), updateProduct);
router.delete('/delete/:id', authenticate, authorize('vendor'), deleteProduct);

module.exports = router;