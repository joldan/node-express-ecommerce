const Product = require('../models/product');
const User = require('../models/user')

const mongoose = require('mongoose');


exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                pageTitle: "Shop",
                prods: products,
                path: '/'
            });
        })
        .catch(err => console.log(err));
} 

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    console.log(prodId)
    console.log(typeof(prodId))
    console.log(prodId.length)
    console.log(mongoose.Types.ObjectId.isValid(prodId))

    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                pageTitle: `product-${product.title}`,
                product: product,
                path: '/product-detail'
            })
        })
        .catch(err => console.log(err));
}

exports.getIndex = (req, res, rel) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                pageTitle: "Shop",
                prods: products,
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getCart = (req, res, rel) => {
    req.user
        .getCart()
        .then(cartProducts => {
            res.render('shop/cart', {
                pageTitle: "Your Cart",
                path: '/cart',
                products: cartProducts
            })
        })
        .catch(err => { console.log(err) })
}

exports.postCart = (req, res, rel) => {
    const prodId = req.body.productId;
    console.log(prodId)
    console.log(typeof(prodId))
    console.log(prodId.length)
    console.log(mongoose.Types.ObjectId.isValid(prodId))
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postCartDeleteProduct = (req, res, rel) => {
    const productId = req.body.productId;
    req.user.deleteCartItem(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, rel) => {
    req.user.getOrders()
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: "Your Orders",
                orders: orders,
                path: '/orders'
            })
        })
        .catch(err => { console.log(err) })


}

exports.postOrder = (req, res, rel) => {
    req.user.addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}


exports.getCheckout = (req, res, rel) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
}