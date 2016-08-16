var Sequelize = require('sequelize');
/**
 * Constructor arguments
 * #1. Database name.
 * #2. Username
 * #3. Password
 */
var sequelize = new Sequelize('auction', 'root', '');
/**
 * User entity
 * @type {Model}
 */
exports.User = sequelize.define('user', {
    username: Sequelize.STRING,
    coins : Sequelize.INTEGER
})/*.sync({force:true})*/;
/**
 * Item entity
 * @type {Model}
 */
exports.Item = sequelize.define('item', {
    item_name: Sequelize.STRING,
    image: Sequelize.STRING,
    quantity: Sequelize.INTEGER,
    username: Sequelize.STRING
})/*.sync({force:true})*/;
