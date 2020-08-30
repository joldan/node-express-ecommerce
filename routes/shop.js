//node imports
const path = require('path');
const express = require('express');

//import controllers
const shopController = require('../controllers/shop');

//Create Router
const router = express.Router(shopController.getProducts)

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.get('/orders', shopController.getOrders)

module.exports = router;