//Node imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//Root dir imports
const rootDir = require('./util/path');

//Import Controllers
const errorController = require('./controllers/errors');
//import DB manager and models
const sequelize = require('./util/database');
const Product = require('./models/product');
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
    User.findByPk(1)
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

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
    //.sync( {force: true} )
    .sync()
    .then(result => {
        return User.findByPk(1)
        //console.log(result)
        app.listen(3000)
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Joaquin', email: 'something@omdharana.com' })
        }
        //values returned inside then blocks are automatically wraped into a promise
        return user;
    })
    .then(user => {
        console.log(user);
        app.listen(3000);
    })
    .catch(err => console.log(err));


