/**
*  Module my app Module
*
* Description
*/
/* global $scope, angular */

'use strict';

angular.module('myApp', ['ngRoute', 'LocalStorageModule', 'ngAnimate'])
.config(function($routeProvider){
	$routeProvider
	.when('/',
	{
		templateUrl:'../templates/main.html'
	})
	.when('/settings',
	{
		controller:'SettingsController',
		templateUrl:'../templates/settings.html'
	})
	.when('/login',
	{
		controller:'LoginController',
		templateUrl:'../templates/login.html'
	})
})
.directive('imageonload', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                $rootScope.$emit('rootScope:emit');
            });
        }
    };
})
.run(function($rootScope, $location, userService) {
    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      if ( !userService.checkIfUserIsAuthenticated()) {
        // no logged user, we should be going to #login
        if ( next.templateUrl == "login.html" ) {
          // already going to #login, no redirect needed
        } else {
          // not going to #login, we should redirect now
          $location.path( "/login" );
        }
      }         
    });
 })
