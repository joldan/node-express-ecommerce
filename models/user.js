const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true }
            }
        ]
    }
});

userSchema.methods.addToCart = function (product) {
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
        updatedCartItems.push({
            productId: product._id,
            quantity: 1
        })
    }

    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save()
}

userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString()
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function(){
    this.cart = {items : []};
    return this.save();
}

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');

// const ObjectId = mongodb.ObjectId;

// class User {
//     constructor(username, email, cart, id) {
//         this.username = username;
//         this.email = email;
//         this.cart = cart; // {items : []}
//         this._id = id;
//     }

//     save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this)
//     }

//     getCart() 

//     deleteCartItem(productId) {
//         //get product index

//         //remove product
//         const db = getDb()
//         return db.collection('users').updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: updatedCartItems } } });
//     }

//     static findById(userId) {
//         const db = getDb();
//         return db.collection('users').findOne({ _id: new ObjectId(userId) })
//             .then(user => {
//                 return user;
//             })
//             .catch(err => console.log(err));
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new ObjectId(this._id),
//                     name: this.username
//                 }
//             }
//             return db.collection('orders').insertOne(order)
//         })
//             .then(result => {
//                 this.cart = { items: [] };
//                 const db = getDb()
//                 return db.collection('users').updateOne(
//                     { _id: new ObjectId(this._id) },
//                     { $set: { cart: { items: [] } } });
//             })
//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection('orders').find({ 'user._id' : new ObjectId(this._id)}).toArray()
//     }
// }

// module.exports = User
