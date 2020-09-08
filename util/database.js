const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Adamantio15', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;