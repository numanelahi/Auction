"use strict";
/**
 * Angular module for various services
 */
angular.module('app.services', [])
    /**
     * Constants to be used inthe app
     */
    .constant('ANGULAR_BASE','/static/javascripts/angular')
    .constant('JS','/js')
    .constant('PARTIALS','/partials')
    /**
     * Service for item related operations.
     */
    .service('items',function ($q, socket) {
        this.getItems = function(username)
        {
            var defered = $q.defer();
            socket.emit('get-items',username);
            socket.on('render-items', function(data){
                defered.resolve(data);
            });
            return defered.promise;
        };
    })
    /**
     * Service for auction related operations.
     */
    .service('auction', function($q, socket){
        /**
         * Method to start an auction
         * @param data
         * @returns {Promise}
         */
        this.start = function (data) {
            var defered = $q.defer();
            socket.emit('start-auction', data);
            socket.on('emit-auction', function(data){
                if(data === 'auction already going on' ){
                    defered.reject(data);
                }
                else{
                    defered.resolve(data);
                }
            });
            return defered.promise;
        };
        /**
         * Methos to check and fetch an ongoing auction.
         * @returns {Promise}
         */
        this.check = function(){
            var defered = $q.defer();
            socket.emit('check-auction');
            socket.on('check-auction-response',function(res){
                if(res ===  'no auctions available'){
                    defered.reject(res);
                }
                else{
                    defered.resolve(res);
                }
            });
            return defered.promise;
        };
        /**
         * Methos to place a bid.
         * @param data
         */
        this.placeBid = function(data){
            var deferred = $q.defer();
            socket.emit('place-bid', data);
            socket.on('bid-fail',function(data){
                if(typeof data === 'string'){
                    deferred.reject(data);
                }else{
                    deferred.resolve();
                }
            });
            return deferred.promise;
        };
    });

