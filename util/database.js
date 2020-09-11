const {Sequelize} = require('sequelize');

//Create sequelize instance, connect it to my DB.
const sequelize = new Sequelize('node-complete', 'root', 'Adamantio15', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;