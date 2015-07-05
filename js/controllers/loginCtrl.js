(function(){
	var LoginController = function($scope, authService, $location) {

		//track login on mixpanel
		mixpanel.track('Open');

		//initializing the authService
		authService.initialize();

		$scope.login = function () {
			authService.connectInstagram()
			.then(function(data) {
				// $scope.user = data.user;
				$location.path('/');
				mixpanel.track('Login Successful');
				mixpanel.identify(data.user.username);
				mixpanel.people.set({
				    "$name": data.user.username,
				    "$last_login": new Date()
				});
			})
		};
	};

	LoginController.$inject = ['$scope', 'authService', '$location'];

	angular.module('myApp').controller('LoginController', LoginController);
}())