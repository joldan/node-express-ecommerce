//Node Package imports
const path = require('path');
const express = require('express');

//router creation
const router = express.Router();

//Controller imports
const productController = require('../controllers/products')

//file logic management

router.get('/add-product', productController.getAddProduct);


router.post('/add-product', productController.postAddProduct);

//exports
module.exports = router;