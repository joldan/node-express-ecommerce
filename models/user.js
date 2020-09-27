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
        let updatedCartItems;
        const cartItemIndex = this.cart.items.findIndex(cartItem => {
            return cartItem.productId.toString() === product._id.toString();
        })
        let updatedQuantity = 1;
        updatedCartItems = [...this.cart.items];
        if (cartItemIndex >= 0) {
            updatedQuantity = updatedCartItems[cartItemIndex].quantity + 1;
            updatedCartItems[cartItemIndex].quantity = updatedQuantity;
        } else {
            updatedCartItems.push({ productId: new ObjectId(product._id), quantity: 1 })
        }
        const updatedCart = { items: updatedCartItems };
        const db = getDb();
        return db.collection('users').updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: updatedCart } });
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(thisProduct => {
            return thisProduct.productId;
        });
        return db.collection('products').find({ _id: { $in: productIds } }).toArray()
            .then(products => {
                return products.map(prod => {
                    return {
                        ...prod,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === prod._id.toString();
                        }).quantity
                    }
                })
            })
            .catch(err => { console.log(err) })
    }

    deleteCartItem(productId) {
        //get product index
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString()
        });
        //remove product
        const db = getDb()
        return db.collection('users').updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: updatedCartItems } } });
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new ObjectId(userId) })
            .then(user => {
                return user;
            })
            .catch(err => console.log(err));
    }

    addOrder() {
        const db = getDb();
        return this.getCart().then(products => {
            const order = {
                items: products,
                user: {
                    _id: new ObjectId(this._id),
                    name: this.username
                }
            }
            return db.collection('orders').insertOne(order)
        })
            .then(result => {
                this.cart = { items: [] };
                const db = getDb()
                return db.collection('users').updateOne(
                    { _id: new ObjectId(this._id) },
                    { $set: { cart: { items: [] } } });
            })
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders').find({ 'user._id' : new ObjectId(this._id)}).toArray()
    }
}

module.exports = User
