//Node imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//Root dir imports
const rootDir = require('./util/path');

//Import Controllers
const errorController = require('./controllers/errors');
//import DB manager
const db = require('./util/database');

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
app.use(express.static(path.join(rootDir, 'public')))

//Configuring routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.controller404);

app.listen(3000)
