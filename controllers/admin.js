const Product = require('../models/product')

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
    //Since user owns products, Sequelize creates an createProduct Function that creates a product
    req.user
        .createProduct({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description
        })
        .then(result => {
            console.log('Created Product')
            res.redirect('/admin/products')
        })
        .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
    req.user
    .getProducts()
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
    req.user
        .getProducts({ where: { id: prodId } }) //WHERE id EQUALS prodId
        .then(products => {
            const product = products[0];
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
    const id = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    Product.findByPk(id)
        .then(product => {
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            product.price = updatedPrice;
            return product.save();
        })
        .then(result => {
            console.log('Updated Product!!!')
            res.redirect('/admin/products')
        })
        .catch()
}

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.findByPk(id)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log("Product Deleted");
            res.redirect('/admin/products');
        })
        .catch(err => { console.log(err) });
}