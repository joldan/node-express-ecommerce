const fs = require('fs');
const path = require('path');

//path of product dara file
const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json' 
    );

module.exports = class Cart{
    static addProduct(id, productPrice){
        //Read cart
        fs.readFile( p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if(!err){
                cart = JSON.parse(fileContent);
            }
            //Analyze cart => find existing products
            const existingProductIndex = cart.products.findIndex(product => product.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            //Add new product / increase quantity
            if(existingProduct){
                updatedProduct = {...existingProduct}
                updatedProduct.qty += 1;
                cart.products=[...cart.products];
                cart.products[existingProductIndex] = updatedProduct;

            }else {
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct]
            }
            //increase price
            cart.totalPrice += cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })
        })

    }
}