"use strict";
/**
 * Angular module for various factories
 */
angular.module('app.factories', [])
    /**
     * Factory to use socket.io in Angular js.
     */
    .factory('socket', function($rootScope){
        /**
         * Creating a client side socket instance.
         */
        var socket = io.connect();
        return {
            /**
             * Method to use "on" with angular js $digest cycle
             * @param event
             * @param callback
             */
            on : function(event, callback){
                socket.on(event, function(){
                    var args = arguments;
                    $rootScope.$apply(function(){
                        callback.apply(socket, args);
                    });
                });
            },
            /**
             * Method to use "emit" with angular js $digest cycle
             * @param event
             * @param data
             * @param callback
             */
            emit : function(event, data, callback){
                socket.emit(event, data, function(){
                    var args = arguments;
                    $rootScope.$apply(function(){
                        callback.apply(socket, args);
                    });
                });
            }
        };
    })
    /**
     * Factory for User Authentication
     */
    .factory('userAuth', function(socket, $q, $timeout, $cookieStore){
        var auth = {
            /**
             * Login method
             * @param username
             * @returns {Promise}
             */
            login: function(username){
                var defered = $q.defer();
                socket.emit('login',username);
                socket.on('login-user',function(data){
                    auth.user = data; //Storing the user details in a data member belonging to auth object
                    $cookieStore.put('user', auth.user); //Storing the user details in the cookie store.
                    defered.resolve();
                });
                return defered.promise;
            },
            /**
             * Logout method
             */
            logout: function(){
                auth.user = undefined; //Removing the user details from the data member belonging to auth object
                $cookieStore.remove('user'); //Removing the user details from the cookie store.
            }
        };
        return auth;
    })
;