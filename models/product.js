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
    constructor(title, imageUrl, description, price){
        this.title = title;
        this.imageUrl = imageUrl,
        this.description = description,
        this.price = price
    }

    save (){
        this.id = Math.random().toString();
        getProductFromFile( products => {
            products.push(this)
            fs.writeFile(productPath,JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
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