const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const rootDir = require('./util/path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views')

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(rootDir, 'public')))

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use( (req, res, next) =>{
    // res.status(404).send('<h1>Oooops, we found a place where nothing exists</h1>')
    res.status(404).render('404',{pageTitle : "Page not found"});
    }); 


app.listen(3000)