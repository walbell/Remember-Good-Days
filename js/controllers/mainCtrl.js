/* global angular */

'use strict';

(function(){

	var MainController = function ($scope, $timeout, $location) {

		//Date object 
		$scope.date={};
		$scope.go = function ( path ) {
		  $location.path( path );
		};

		var updateTime = function(){
			$scope.date.raw=new Date();
			$timeout(updateTime, 1000);
		};

		updateTime();
	};

	MainController.$inject = ['$scope', '$timeout', '$location'];

	angular.module('myApp').controller('MainController', MainController);

}());
