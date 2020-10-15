const Product = require('../models/product');
const User = require('../models/user')
const Order = require('../models/order')


const mongoose = require('mongoose');



exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                pageTitle: "Shop",
                prods: products,
                path: '/',
                isLoggedIn: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    console.log(prodId)
    console.log(typeof (prodId))
    console.log(prodId.length)
    console.log(mongoose.Types.ObjectId.isValid(prodId))

    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                pageTitle: `product-${product.title}`,
                product: product,
                path: '/product-detail',
                isLoggedIn: req.session.isLoggedIn
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
                path: '/',
            });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getCart = (req, res, rel) => {
    req.loggedUserMongooseObject
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const cartProducts = user.cart.items;
            console.log(cartProducts)
            res.render('shop/cart', {
                pageTitle: "Your Cart",
                path: '/cart',
                products: cartProducts,
                isLoggedIn: req.session.isLoggedIn
            })
        })
        .catch(err => { console.log(err) })
}

exports.postCart = (req, res, rel) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.loggedUserMongooseObject.addToCart(product);
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
    req.loggedUserMongooseObject.removeFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, rel) => {
    Order.find({ 'user.id' : req.loggedUserMongooseObject._id })
        .then(orders => {
            console.log(orders)
            console.log(orders[0].products)
            res.render('shop/orders', {
                pageTitle: "Your Orders",
                orders: orders,
                path: '/orders',
                isLoggedIn: req.session.isLoggedIn
            })
        })
        .catch(err => { console.log(err) })
}

exports.postOrder = (req, res, rel) => {
    req.loggedUserMongooseObject
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const cartProducts = user.cart.items.map(thisProd => {
                return { quantity: thisProd.quantity, productData: { ...thisProd.productId._doc } }
            });
            console.log(cartProducts)
            const order = new Order({
                user: {
                    name: req.loggedUserMongooseObject.name,
                    id: req.loggedUserMongooseObject
                },
                products: cartProducts
            })
            return order.save()
        })
        .then(() => {
            return req.loggedUserMongooseObject.clearCart()
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};


exports.getCheckout = (req, res, rel) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
        isLoggedIn: req.session.isLoggedIn
    })
}