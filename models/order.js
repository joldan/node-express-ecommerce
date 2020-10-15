const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [ {
        productData : {
            type: Object,
            required: true
        }, 
        quantity : {
            type: Number,
            required: true
        } 
    }
    ],
    user: {
        id: {
            type : Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        email: {
            type: String,
            required: true
        }

    }
})

module.exports = mongoose.model('Order', orderSchema)