angular.module('nutritionApp', ['md.data.table', 'ngMaterial', 'ui.router','ngAnimate', 'ngSanitize', 'ngMdIcons'])


  .config(mdTableConfiguration);


function mdTableConfiguration($mdThemingProvider, $locationProvider,$stateProvider, $urlRouterProvider,$httpProvider,$compileProvider) {
    'use strict';

    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('pink');

    $urlRouterProvider.otherwise("/nutrition");

    $stateProvider
        .state('nutrition', {
            url: "/nutrition",
            templateUrl: "scripts/nutrition/nutrition.html",
            controller : "nutritionController"
        })
        .state('plm', {
            url : "/plm",
            templateUrl : "scripts/plm/plm.html",
            controller : "plmController"
        })

}
