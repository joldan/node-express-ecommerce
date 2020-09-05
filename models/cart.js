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
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })
        })
    }

    static getCart(callback){
        fs.readFile(p, (err, fileContent) => {
            if (!err) {
                const cart = JSON.parse(fileContent);
                callback(cart)
            }else{
                callback(null);
            }
        })
    }

    static deleteProduct(id, price){
        //read file
        fs.readFile( p, (err, fileContent) =>{
            if(err){
                return;
            }
            // Import cart
            const cart = JSON.parse(fileContent);
            const updatedCart = {...cart};
            // Find Product to delete
            const productIndex = updatedCart.products.findIndex( product => product.id === id);
            console.log(productIndex)
            if(productIndex === -1){
                return;
            }
            const qty = updatedCart.products[productIndex].qty;            
            // Delete product
            updatedCart.products.splice(productIndex, 1);
            // Adjust Cart Price
            updatedCart.totalPrice =  updatedCart.totalPrice - qty * Number(price);
            // Write File
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err)
            })
        })      
    }
}