//Node Package imports
const path = require('path');
const express = require('express');

//router creation
const router = express.Router();

//Controller imports
const adminController = require('../controllers/admin')

//file logic management

//admin/add-products
router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getProducts);

router.post('/add-product', adminController.postAddProduct);

//exports
module.exports = router;