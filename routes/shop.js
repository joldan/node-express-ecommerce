//node imports
const path = require('path');
const express = require('express');

//import controllers
const productController = require('../controllers/products');

//Create Router
const router = express.Router(productController.getProducts)

router.get('/', productController.getProducts);

module.exports = router;