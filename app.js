//Node imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);


//Root dir imports
const rootDir = require('./util/path');

//Import Controllers
const errorController = require('./controllers/errors');
const User = require('./models/user')

const MONGODB_URI = 'mongodb+srv://ecomApp:4Bmk82KRrN4rkzyj@node-ecom.zfwd4.mongodb.net/node-ecom?retryWrites=true&w=majority'

//App creation
const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
  });

//Templating Engine Configuration
app.set('view engine', 'ejs');
app.set('views', 'views')


//Importing Routes Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')

//Configure Midleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));
app.use(session({secret : 'my secret', resave : false, saveUninitialized : false, store: store}));

// this midlware adds user 1 to any request
app.use((req, res, next) => {
    if(req.session.user){
        const loggedUserId = req.session.user._id
        User.findById(loggedUserId)
            .then( loggedUserMongooseObject => {
                req.loggedUserMongooseObject = loggedUserMongooseObject;
                next();
            })
            .catch( err => console.log(err));
    }else{
        next()
    }
})

//Configuring routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.use(errorController.controller404);


//Connect to DB

mongoose.connect(MONGODB_URI)
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
