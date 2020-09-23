//Node imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//Root dir imports
const rootDir = require('./util/path');

//Import Controllers
const errorController = require('./controllers/errors');
const mongoConnect = require('./util/database').mongoConnect;

//App creation
const app = express();

//Templating Engine Configuration
app.set('view engine', 'ejs');
app.set('views', 'views')


//Importing Routes Routes
const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

//Configure Midleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

//this midlware adds user 1 to any request
app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then( user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch( err => console.log(err));
    next();
})

//Configuring routes
app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(errorController.controller404);


//Connect to DB

mongoConnect( () => {
    app.listen(3000);
})
