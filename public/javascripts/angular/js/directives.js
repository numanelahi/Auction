"use strict";
/**
 * Angular module for various directives
 */
angular.module('app.directives', [])
    /**
     * Directive for player widget
     */
    .directive('userWidget',function(){
        return {
            replace: false,
            restrict: 'A',
            templateUrl: '/static/javascripts/angular/partials/userWidget.html'
        };
    })
    /**
     * Directive for inventory widget
     */
    .directive('inventoryWidget',function(){
        return {
            replace: false,
            restrict: 'A',
            templateUrl: '/static/javascripts/angular/partials/inventoryWidget.html'
        };
    })
    /**
     * Directive for auction widget
     */
    .directive('currentAuctionWidget',function(){
        return {
            replace: false,
            restrict: 'A',
            templateUrl: '/static/javascripts/angular/partials/currentAuctionWidget.html',
            link: function(scope, elem, attr){
                scope.validateCoins = scope.user.coins;
            }
        };
    })
;

