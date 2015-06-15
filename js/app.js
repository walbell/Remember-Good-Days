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
});
