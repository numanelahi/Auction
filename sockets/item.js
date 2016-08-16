var Entities = require('../entities/Entity');
var User = Entities.User;
var Item = Entities.Item;
/**
 * Module for listening to events related to items.
 * @param io
 */
module.exports = function(io){
    "use strict";
    io.on('connection', function(socket){
        /**
         * Listener of "get-item" event
         */
        socket.on('get-items', function(username){
            /**
             * Querying for the items belonging to a specific user.
             */
           Item.findAll({where:{username:username}})
               .then(function(data){
                   /**
                    * Emitter for queried items.
                    */
                   socket.emit('render-items',data);
               });
        });
    });
};