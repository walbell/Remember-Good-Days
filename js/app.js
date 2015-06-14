/**
*  Module my app Module
*
* Description
*/
/* global $scope, angular */

'use strict';

angular.module('myApp', ['ngRoute', 'LocalStorageModule'])
.config(function($routeProvider){
	$routeProvider
	.when('/',
	{
		controller:'ImagesController',
		templateUrl:'../templates/main.html'
	})
	.when('/settings',
	{
		controller:'SettingsController',
		templateUrl:'../templates/settings.html'
	})
})
