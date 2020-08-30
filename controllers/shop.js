const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll(products => {
        res.render('shop/product-list', {
            pageTitle: "Shop",
            prods: products,
            path: '/'
        });
    });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    console.log(prodId);
    Product.findById(prodId, product => {
        console.log(product);
        res.render( 'shop/product-detail', {
            pageTitle: `product-${product.title}`,
            product: product,
            path: '/product-detail'
        }) 
    });
}

exports.getIndex = (req, res, rel) => {
    const products = Product.fetchAll(products => {
        res.render('shop/index', {
            pageTitle: "Shop",
            prods: products,
            path: '/'
        });
    });
}

exports.getCart = (req, res, rel) => {
    res.render('shop/cart', {
        pageTitle: "Your Cart",
        path: '/cart'
    })
}

exports.postCart = (req, res, rel) =>  {
    const prodId = req.body.productId.trim();
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}

exports.getOrders = (req, res, rel) => {
    res.render('shop/cart', {
        pageTitle: "Your Orders",
        path: '/oreders'
    })
}


exports.getCheckout = (req, res, rel) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
}