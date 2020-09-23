const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

MongoClient.connect('mongodb+srv://ecomApp:4Bmk82KRrN4rkzyj@node-ecom.zfwd4.mongodb.net/node-ecom?retryWrites=true&w=majority')
.then(result => {
    console.log('connected');
})
.catch(err => {
    console.log(err);
})