const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
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
    Product.fetchAll()
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
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
    // let fetchedCart;
    // let newQuantity = 1;
    // req.user
    //     //get cart
    //     .getCart()
    //     .then(cart => {
    //         //Find products in cart to see if add or increase product
    //         fetchedCart = cart;
    //         return cart.getProducts({ where: { id: prodId } })
    //     })
    //     .then(products => {
    //         let product;
    //         //if product is present
    //         if (products.length > 0) {
    //             product = products[0];
    //         }
    //         if (product) {
    //             const oldQuantity = product.cartItem.quantity;
    //             newQuantity = oldQuantity + 1;
    //             return product;
    //         }
    //         // If new product. Find product by its ID
    //         return Product.findByPk(prodId)
    //     })
    //     .then(product => {
    //         return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    //     })
    //     .then(() => {
    //         res.redirect('/cart');
    //     })
    //     .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, rel) => {
    const productId = req.body.productId;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productId } })
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, rel) => {
    req.user.getOrders({ include: ['products'] })
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
    let fetchedCart;
    let cartProducts;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            cartProducts = products;
            return req.user.createOrder()
        })
        .then(order => {
            return order.addProducts(cartProducts.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
            }));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
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