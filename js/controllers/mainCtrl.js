/* global angular */

'use strict';

(function(){

	var MainController = function ($scope, $timeout, $location, userService) {

		//Date object 
		$scope.date={};
		$scope.go = function ( path ) {
		  $location.path( path );
		};

		$scope.logout = function () {
			userService.logout();
		}

		var updateTime = function(){
			$scope.date.raw=new Date();
			$timeout(updateTime, 1000);
		};

		updateTime();
	};

	MainController.$inject = ['$scope', '$timeout', '$location', 'userService'];

	angular.module('myApp').controller('MainController', MainController);

}());
