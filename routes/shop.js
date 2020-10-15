//node imports
const path = require('path');
const express = require('express');

//import controllers
const shopController = require('../controllers/shop');

//Create Router
const router = express.Router(shopController.getProducts)
const isAuth = require('../middleware/is-auth');


router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-product',isAuth,  shopController.postCartDeleteProduct);

router.get('/orders', isAuth, shopController.getOrders);

router.post('/create-order',isAuth,  shopController.postOrder);

module.exports = router;