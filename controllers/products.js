const Product = require('../models/product')


exports.getAddProduct = (req, res, next) => { 
    console.log('in get add product')
    const products = Product.fetchAll( products => {
        res.render('add-product', {
                pageTitle: 'Add Product',
                prods : products,
                path: '/admin/add-product',
                formCSS : true,
                productCSS : true,
                activeAddProduct : true
        });
    });
};

exports.postAddProduct = (req, res, next)=> {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => { 
    console.log('in get products')
    const products = Product.fetchAll( products => {
        res.render('shop', {
            pageTitle : "Shop",
            prods : products,
            path: '/',
            hasProducts : products.length > 0,
            activeShop : true,
            productCSS : true
        });
    });
}