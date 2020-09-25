const Product = require('../models/product');
const mongodb = require('mongodb');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const id = null;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const userId = req.user._id;
    //Since user owns products, Sequelize creates an createProduct Function that creates a product
    const product = new Product(title, imageUrl, price, description, null, userId);
    product
        .save()
        .then(result => {
            console.log('Created Product')
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('admin/products', {
                pageTitle: "Admin Products",
                prods: products,
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                product: product,
                path: '/admin/edit-product',
                editing: editMode
            });
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    const updatedProduct = new Product(updatedTitle, updatedImageUrl, updatedPrice, updatedDescription, prodId);
    updatedProduct.save()
        .then(result => {
            console.log('Updated Product!!!')
            res.redirect('/admin/products')
        })
        .catch()
}

exports.postDeleteProduct = (req, res, next) => {
    console.log('#############################')
    const prodId = req.body.productId;
    console.log(prodId)
    Product.deleteById(prodId)
        .then( () => {
            res.redirect('/admin/products');
        })
        .catch(err => { console.log(err) });
}