'use strict';

var app = angular.module('beerapp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl : 'views/main.html',
        controller  : 'CtrlMain'
      })
      .when('/about', {
        templateUrl : 'about.html',
        controller  : 'CtrlAbout'
      })
      .otherwise({
          redirectTo: '/'
      });
});

app.controller('CtrlMain', function($scope) {
  Beer.start_coccion();

  $scope.coccion = Beer.getData();

  $scope.start_coccion = function(){ }

});
