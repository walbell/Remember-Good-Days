(function(){
	var LoginController = function($scope, authService, $location) {

		//initializing the authService
		authService.initialize();

		$scope.login = function () {
			authService.connectInstagram()
			.then(function(data) {
				// $scope.user = data.user;
				$location.path('/');
			})
		};
	};

	LoginController.$inject = ['$scope', 'authService', '$location'];

	angular.module('myApp').controller('LoginController', LoginController);
}())