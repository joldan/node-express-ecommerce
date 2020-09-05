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
    Product.findById(prodId, product => {
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
    Cart.getCart( cart => {
        Product.fetchAll( products => {
            const cartProducts = [];
            for(product of products){
                const cartProductData = cart.products.find(prod => prod.id === product.id)
                if(cartProductData){
                    cartProducts.push({productData:product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                pageTitle: "Your Cart",
                path: '/cart',
                totalPrice: cart.totalPrice,
                products: cartProducts
            })
        })
    })
}

exports.postCart = (req, res, rel) =>  {
    const prodId = req.body.productId.trim();
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, rel) =>{
    const productId = req.body.productId;
    Product.findById(productId, product => {
        console.log(product);
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart')
    })
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