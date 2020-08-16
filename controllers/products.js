const products = [];

exports.getAddProduct = (req, res, next) => { 
    // console.log('In yet another the middleware')
    res.render('add-product', {
            pageTitle: 'Add Product',
            prods : products,
            path: '/admin/add-product',
            formCSS : true,
            productCSS : true,
            activeAddProduct : true
    }
)};

exports.postAddProduct = (req, res, next)=> {
    products.push({title : req.body.title})
    res.redirect('/');
}

exports.getProducts = (req, res, next) => { 
    res.render('shop', {
        pageTitle : "Shop",
        prods : products,
        path: '/',
        hasProducts : products.length > 0,
        activeShop : true,
        productCSS : true
    });
}