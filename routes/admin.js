const path = require('path');
const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => { 
        // console.log('In yet another the middleware')
        res.sendFile(path.join(rootDir,'views','add-product.html'));
        // res.send('<form action="/admin/product" method="POST"><input  type="text" name="title" type="submit"><button>Add Product</button></form>');
});

router.post('/add-product', (req, res, next)=> {
        products.push({title : req.body.title})
        res.redirect('/');
});

exports.routes = router;
exports.products = products;