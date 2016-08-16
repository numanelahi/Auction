var Entities = require('../entities/Entity');
var User = Entities.User;
var Item = Entities.Item;
/**
 * Module for listening to all socket events related to auction.
 * @param io
 */
module.exports = function(io){
    "use strict";
    /**
     * Object for holding auction data.
     * @type {{}}
     */
    var auctionHolder = {};

    io.on("connection", function(socket){
        /**
         * Listener for an event to start the auction.
         */
        socket.on('start-auction', function(data){
            console.log(data);
            /**
             * Check whether there is an auction in progress or not.
             */
            if(!auctionHolder.auction){
                auctionHolder.auction = data;
                auctionHolder.auction.time = 90;
                io.emit('emit-auction', auctionHolder.auction);
                var clear = setInterval(function(){
                    auctionHolder.auction.time -= 1;
                    io.emit('auction-timer', auctionHolder.auction.time);
                    /**
                     * Checking if the count down has reached zero.
                     */
                    if(auctionHolder.auction.time === 0 ){
                        /**
                         * Checking is anyone has made a bid.
                         */
                        if(auctionHolder.auction.winner){
                            /**
                             * Emmiter that broadcasts the declare-winner event to all users.
                             */
                            io.emit('declare-winner');
                            /**
                             * Incrementing seller's coins.
                             */
                            User.find({where:{username:auctionHolder.auction.username}})
                                .then(function(user){
                                    user.increment('coins',{by:auctionHolder.auction.winningBid});
                                });
                            /**
                             * Decrementing buyer's coins.
                             */
                            User.find({where:{username:auctionHolder.auction.winner}})
                                .then(function(user){
                                    user.decrement('coins',{by:auctionHolder.auction.winningBid});
                                });
                            /**
                             * Updating seller's inventory.
                             */
                            Item.find({where: {username: auctionHolder.auction.username, item_name: auctionHolder.auction.item_name}})
                                .then(function(item){
                                    item.decrement('quantity',{by: auctionHolder.auction.aucQty});
                                });
                            /**
                             * Updating buyer's inventory.
                             */
                            Item.find({where: {username: auctionHolder.auction.winner, item_name: auctionHolder.auction.item_name}})
                                .then(function(item){
                                    item.increment('quantity',{by: auctionHolder.auction.aucQty});
                                });
                        }
                        /**
                         * Case if no bid has been made during the 90 secs.
                         */
                        else{
                            /**
                             * Emitter to broadcast the end-auction event to all users if no bid is made by any user.
                             */
                            io.emit('end-auction');
                            delete auctionHolder.auction;
                            clearInterval(clear);
                        }
                    }
                    /**
                     * Check to clear the auction data 10 seconds after the count down stops.
                     */
                    if(auctionHolder.auction && auctionHolder.auction.time === -10 ){
                        /**
                         * Emitter to broadcast the end-auction event to all users if a bid is made.
                         */
                        io.emit('end-auction');
                        delete auctionHolder.auction;
                        clearInterval(clear);
                    }
                },1000);
            }
            /**
             * Case, when trying to start an auction while another auction already in progress.
             */
            else
            {
                /**
                 * Emitter to notify user of an on going auction.
                 */
                 socket.emit('emit-auction', 'auction already going on');
            }
        });
        /**
         * Check if there is an auction currently in progress to be displayed on dashboard.
         */
        socket.on('check-auction', function(){
            if(auctionHolder.auction){
                /**
                 * Emitter to emit an ongoing event to user's dashboard.
                 */
                socket.emit('check-auction-response', auctionHolder.auction);
            }
            else{
                /**
                 * Emitter to notify user that there is no ongoing auction.
                 */
                socket.emit('check-auction-response', 'no auctions available');
            }
        });
        /**
         * Listener for the event to place a bid.
         */
        socket.on('place-bid',function(data){
            /**
             * Checking if the bid amount is greater than minimum bid.
             */
            if((!auctionHolder.auction.winningBid && parseInt(data.amount) >= parseInt(auctionHolder.auction.minBid)) || (parseInt(auctionHolder.auction.winningBid) < parseInt(data.amount))){
                auctionHolder.auction.winner = data.name;
                auctionHolder.auction.winningBid = data.amount;
                auctionHolder.auction.time = auctionHolder.auction.time > 10 ? auctionHolder.auction.time : 10; // Checking if the time left is less than 10 seconds
                /**
                 * Emitter to emit updated auction widget data
                 */
                io.emit('emit-auction', auctionHolder.auction);
                /**
                 * Event for unit testing purpose
                 */
                socket.emit('test-emit-auction', auctionHolder.auction);
                socket.emit('bid-fail');
            }
            else{
                socket.emit('bid-fail', 'Failed to place bid');
            }
        });
    });
};