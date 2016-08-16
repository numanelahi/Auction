"use strict";
angular.module('app.controllers', [])
    /**
     * Controller for Login screen
     */
    .controller('login', function($scope, userAuth, $state){
        /**
         * Checking if a user is already logged in.
         */
        if(userAuth){
            $state.go('dashboard');
        }
        $scope.btnVal = "Login";
        /**
         * Function to login a user.
         */
        $scope.login = function(){
            if($scope.username){
                $scope.btnVal = "Logging in...";
                userAuth.login($scope.username)
                    .then(function(){
                        $state.go('dashboard');
                    },function(){

                    })
                    .finally(function(){
                        $scope.btnVal = "Login";
                    });
            }
            else{
                alert("You forgot to enter your username");
            }
        };
    })
    /**
     * Controller for Dashboard
     */
    .controller('dashboard', function($scope, userAuth, $state, user, items, auction, socket, $cookieStore){
        /**
         * Function to check for ongoing auctions.
         */
        var checkAuc = function(){
            auction.check()
                .then(function(res){
                    $scope.aucFlag = true;
                    $scope.auctionData = res;
                },function(error){
                    $scope.aucMsg = error;
                });
        };
        /**
         * Event listener for an auction started by another user
         */
        socket.on('emit-auction',function(res){
           if(typeof res === "object" ){
               $scope.aucFlag = true;
               $scope.auctionData = res;
           }
        });
        /**
         * Event listener for updating the timer
         */
        socket.on('auction-timer',function(data){
            if(parseInt(data) >= 0){
                $scope.auctionData.time = data;
            }
        });
        /**
         * Event listener for declaring the winner
         */
        socket.on('declare-winner',function(){
            $scope.winnerDec = true;
            /**
             * Updating the winners client side data models
             */
            if(userAuth.user.username === $scope.auctionData.winner)
            {
                /**
                 * Updating coins
                 */
                $scope.user.coins -= $scope.auctionData.winningBid;
                $cookieStore.put('user', $scope.user);
                /**
                 * Updating the inventory
                 * @type {number}
                 */
                var i = 0;
                $scope.items.forEach(function(item){
                    if(item.item_name === $scope.auctionData.item_name){
                        $scope.items[i].quantity +=  $scope.auctionData.aucQty;
                    }
                    i++;
                });
            }
            /**
             * Updating the sellers client side data model
             */
            else if(userAuth.user.username === $scope.auctionData.username){
                /**
                 * Updating coins
                 */
                $scope.user.coins += $scope.auctionData.winningBid;
                $cookieStore.put('user', $scope.user);
                /**
                 * Updating the inventory
                 * @type {number}
                 */
                var j = 0;
                $scope.items.forEach(function(item){
                    if(item.item_name === $scope.auctionData.item_name){
                        $scope.items[j].quantity -=  $scope.auctionData.aucQty;
                    }
                    j++;
                });
            }
        });
        /**
         * Event listener for ending the auction.
         */
        socket.on('end-auction', function(){
            if(!$scope.auctionData.winner && $scope.auctionData.username === $scope.user.username){
                alert('Item not sold');
            }
            $scope.winnerDec = false;
            $scope.aucFlag = false;
            checkAuc();
        });
        $scope.id = "Dashboard";
        $scope.user = user;
        /**
         * Check for ongoing auctions when the controller is initialized.
         */
        checkAuc();
        /**
         * Logout function
         */
        $scope.logout = function(){
            userAuth.logout();
            $state.go('login');
        };
        /**
         * Getting the inventory data when the controller is initialized.
         */
        items.getItems($scope.user.username)
            .then(function(data){
                $scope.items = data;
            });
        /**
         * Grabbing the item details when put up for auction
         */
        $scope.showPopup = function(){
            $scope.selItem = this.item;
        };
        /**
         * Function to start an auction
         */
        $scope.startAuction = function()
        {
            /**
             * Using the grabbed item data in showPopup() to start an auction
             */
            $scope.selItem.aucQty = $scope.aucQty;
            $scope.selItem.minBid = $scope.minBid;
            auction.start($scope.selItem)
                .then(function(data){
                    $scope.aucFlag = true;
                    $scope.auctionData = data;
                },function(error){
                    alert(error);//TODO
                });
        };
        /**
         * Function to place a bid.
         */
        $scope.placeBid = function(){
            $scope.validateCoins -= $scope.proposedBid;
            auction.placeBid({name:user.username,amount:$scope.proposedBid})
                .then(function(){},function(error){
                    alert(error);
                });
        };

    });

/**
 * Angular module to listen for state change events and session management.
 */
angular.module('app.controllers').run(function($rootScope, $state, $cookieStore, userAuth){
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
        if(error.unauthorized){
            $state.go('login');
        }
    });
    userAuth.user = $cookieStore.get('user');
});
