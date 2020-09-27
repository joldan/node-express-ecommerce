const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart; // {items : []}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this)
    }

    addToCart(product) {
        let updatedCart;
        let updatedCartItems;
        console.log(this.cart)
        const cartItemIndex = this.cart.items.findIndex(cartItem => {
            return cartItem.productId.toString() === product._id.toString();
        })
        let updatedQuantity = 1;
        updatedCartItems = [...this.cart.items];
        if (cartItemIndex >= 0) {
            //copy cart
            //update value of quantity of given product
            updatedQuantity = updatedCartItems[cartItemIndex].quantity + 1;
            updatedCartItems[cartItemIndex].quantity = updatedQuantity;
        } else {
            updatedCartItems.push({ productId: new ObjectId(product._id), quantity: 1 })
        }
        updatedCart = { items: updatedCartItems };
        const db = getDb();
        return db.collection('users').updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: updatedCart } });
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new ObjectId(userId) })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }
}

module.exports = User
