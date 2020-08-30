const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => { 
    const products = Product.fetchAll( products => {
        res.render('admin/add-product', {
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
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll(products => {
        res.render('admin/products', {
            pageTitle: "Admin Products",
            prods: products,
            path: '/admin/products'
        });
    });
}