//Node imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//Root dir imports
const rootDir = require('./util/path');

//Import Controllers
const errorController = require('./controllers/errors');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

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

//this midlware adds user 1 to any request
app.use((req, res, next) => {
    User.findById('5f6df3260e62e90e90bb33c3')
        .then( user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch( err => console.log(err));
})

//Configuring routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.controller404);


//Connect to DB

mongoConnect( () => {
    app.listen(3000);
})
