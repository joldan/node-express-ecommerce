const {Sequelize} = require('sequelize');

//Create sequelize instance, connect it to my DB.
const sequelize = new Sequelize('node-complete', 'root', 'MySqlFun2020', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;