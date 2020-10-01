//Node imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Root dir imports
const rootDir = require('./util/path');

//Import Controllers
const errorController = require('./controllers/errors');
const User = require('./models/user')

//App creation
const app = express();

//Templating Engine Configuration
app.set('view engine', 'ejs');
app.set('views', 'views')


//Importing Routes Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//Configure Midleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

// this midlware adds user 1 to any request
app.use((req, res, next) => {
    User.findById('5f75bb417967b00c46e6682c')
        .then( user => {
            req.user = user;
            next();
        })
        .catch( err => console.log(err));
})

//Configuring routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.controller404);


//Connect to DB

mongoose.connect('mongodb+srv://ecomApp:4Bmk82KRrN4rkzyj@node-ecom.zfwd4.mongodb.net/node-ecom?retryWrites=true&w=majority')
.then( result => {
    User.findOne().then(user => {
        if(user){
            const user = new User( {
                name : 'Alfredo',
                email : 'alfredo@omdharana.com',
                cart : {
                    items: []
                }
            })
        }
        user.save();
    })
    app.listen(3000)
})
.catch( err => console.log(err))
