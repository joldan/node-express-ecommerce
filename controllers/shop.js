const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.findAll()
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
    Product.findByPk(prodId)
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
    Product.findAll()
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
        .then(cart => {
            return cart.getProducts();
        })
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
    const prodId = req.body.productId.trim();
    let fetchedCart;
    let newQuantity = 1;
    req.user
    //get cart
    .getCart()
        .then(cart => {
            //Find products in cart to see if add or increase product
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } })
        })
        .then(products => {
            let product;
            //if product is present
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            // If new product. Find product by its ID
            return Product.findByPk(prodId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, {through : {quantity : newQuantity}});
        })
        .then( () => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, rel) => {
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