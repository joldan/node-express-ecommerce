const path = require('path');
const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin')

const router = express.Router()


router.get('/', (req, res, next) => { 
    // console.log('In yet another the middleware')
    // res.send("<h1>Hello from express</h1>");
    const products = adminData.products;
    console.log(adminData.products);
    res.render('shop', {
        pageTitle : "Shop",
        prods : products,
        path: '/',
        hasProducts : products.length > 0,
        activeShop : true,
        productCSS : true
    });
});

module.exports = router;