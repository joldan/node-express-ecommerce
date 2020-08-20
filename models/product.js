const fs = require('fs')
const path = require('path')

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json' 
    );

const getProductFromFile = (callback) => {
    console.log('in get Product From file');
    console.log(callback);
    fs.readFile(p, (err, fileContent) => {  
        if(err){
            return callback([]);
        }
        callback(JSON.parse(fileContent));
    })
}

module.exports = class Product {
    constructor(title){
        this.title = title;
    }

    save (){
        console.log('in save')
        getProductFromFile( products => {
            products.push(this)
            fs.writeFile(p,JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }
    
    static fetchAll(callback){
        console.log('in fetch')
        console.log(callback);
        getProductFromFile(callback);
    }
}