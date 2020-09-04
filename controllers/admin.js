const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => { 
        res.render('admin/edit-product', {
                pageTitle: 'Add Product',
                path: '/admin/add-product',
                editing : false
        });
};

exports.postAddProduct = (req, res, next)=> {
    const id = null;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(id, title, imageUrl, description, price);
    product.save();
    res.redirect('/admin/products');
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

exports.getEditProduct = (req, res, next) => { 
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    const products = Product.findById(prodId, product => {
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                product : product,
                path: '/admin/edit-product',
                editing: editMode
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const updatedProduct = new Product(id, title, imageUrl, description, price);
    updatedProduct.save();
    res.redirect('/admin/products')
}

exports.postDeleteProduct = (req, res, next) =>{
    const id = req.body.productId;
    Product.deleteById(id);
    res.redirect('/admin/products')

}