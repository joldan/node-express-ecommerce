const getDb = require('../util/database').getDb;

class Product {
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        const db = getDb();
        return db.collection('products')
            .insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            })
    };
}

module.exports = Product;