var Entities = require('../entities/Entity');
var User = Entities.User;
var Item = Entities.Item;
/**
 * This module listens to all the socket event related to user.
 * @param io
 */
module.exports = function(io)
{
    "use strict";
    io.on('connection',function(socket){
        /**
         * Success callback
         */
        /**
         * Listener for login event
         */
        socket.on('login',function(username){
            /**
             * Checking if user already exists.
             */
            User.find({
                where:{
                    username: username
                }
            }).then(function(data){
                /**
                 * If user doesn't exist then create one.
                 */
                if(!data){
                    /**
                     * Creating the user
                     */
                    User.create({username: username, coins: 1000})
                        .then(function(user){
                            socket.emit('login-user', user.get({plain:true}));
                        },function(){});
                    /**
                     * Creating the item for inventory belonging to user created above
                     */
                    Item.bulkCreate([
                        {item_name: "Bread", image: "http://www.topmattressreviews.net/data/wallpapers/1/bread_683556.jpg", quantity: "30", username:username},
                        {item_name: "Carrot", image: "http://www.clipartlord.com/wp-content/uploads/2016/05/carrots18.png", quantity: "18", username:username},
                        {item_name: "Diamond", image: "http://pngimg.com/upload/diamond_PNG6683.png", quantity: "1", username:username}
                        ]);
                }
                /**
                 * Case when user exists
                 */
                else{
                    /**
                     * Emitter for the user queried form database.
                     */
                    socket.emit('login-user', data.get({plain:true}));
                }
            }, function(error){
                /**
                 * Error callback
                 */
                console.log(error);
            });
        });
    });
};