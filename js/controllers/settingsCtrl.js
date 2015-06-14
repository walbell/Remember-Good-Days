/* global angular, authService, $scope */

'use strict';

(function(){

	var SettingsController = function ($scope,authService) {

		console.log('SettingsController');


		//initializing the authService
		
		authService.initialize();

		$scope.login = function () {
			console.log('login');

			authService.connectInstagram()
			.then(function(data) {
				console.log('data is ',data);
				$scope.user = data.user;
			})

		};
	}

	SettingsController.$inject = ['$scope', 'authService'];

	angular.module('myApp').controller('SettingsController', SettingsController);

}());
