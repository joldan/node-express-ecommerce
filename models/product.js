const fs = require('fs')
const path = require('path')

//path of product dara file
const productPath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json' 
    );

//reads file and passes it to a callback function after file is read
const getProductFromFile = (callback) => {
    fs.readFile(productPath, (err, fileContent) => {  
        if(err){
            return callback([]);
        }
        callback(JSON.parse(fileContent));
    })
}

//product model class
module.exports = class Product {
    constructor(id, title, imageUrl, description, price){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl,
        this.description = description,
        this.price = price
    }

    save (){
        getProductFromFile( products => {
            if(this.id){
                const existingProductIndex = products.findIndex( prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(productPath,JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });
            }else{
                this.id = Math.random().toString();
                products.push(this)
                fs.writeFile(productPath,JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById(id) {
        getProductFromFile( products => {
            const productToDeleteIndex = products.findIndex(prod => prod.id === id);
            const updatedProducts = [...products];
            updatedProducts.splice(productToDeleteIndex, 1);
            fs.writeFile(productPath,JSON.stringify(updatedProducts), (err) => {
                console.log(err);
            });
        })
    }
    
    static findById(id, cb) {
        getProductFromFile(products => {
            //console.log(products);
            const product = products.find( prod => {
                return prod.id === id});
            cb(product)
        })
    }

    static fetchAll(callback){
        getProductFromFile(callback);
    }
}