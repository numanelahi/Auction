"use strict";

angular.module('app',[
    'app.controllers',
    'app.factories',
    'ui.router',
    'app.services',
    'app.directives',
    'ngCookies'
])
.config(function($stateProvider, $urlRouterProvider, $locationProvider, ANGULAR_BASE, PARTIALS){
    $stateProvider.state('login',{
        url: '/login',
        controller: 'login',
        templateUrl: ANGULAR_BASE + PARTIALS + '/login.html'
    })
    .state('dashboard',{
        url: '/',
        controller: 'dashboard',
        templateUrl: ANGULAR_BASE + PARTIALS + '/dashboard.html',
        resolve: {
            user: function (userAuth, $q) {
                return userAuth.user || $q.reject({unauthorized: true});
            }
        }
    });
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(false);
})
;