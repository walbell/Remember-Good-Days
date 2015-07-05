(function(){
	var userService = function (localStorageService, $location) {
		return {
			storeUserToken: function(user_token){
				localStorageService.set('user_token', user_token);
			},
			getUserToken: function(){
				var userToken = localStorageService.get('user_token');
				return userToken;
			},
			storeUserId: function(user_id){
				localStorageService.set('user_id', user_id);
			},
			getUserId: function(){
				var user_id = localStorageService.get('user_id');
				return user_id;
			},
			storeUserFeed: function(user_feed){
				localStorageService.set('user_feed', user_feed);
			},
			getUserFeed: function(){
				return localStorageService.get('user_feed') || [];
			},
			storeCurrentUserTimestamp: function(){
				localStorageService.set('user_timestamp', new Date());
			},
			getCurrentUserTimestamp: function(){
				return localStorageService.get('user_timestamp');
			},
			checkIfUserIsAuthenticated: function(){
				return localStorageService.get('user_token') ? true : false;
			},
			logout: function(){
				localStorageService.clearAll();
				$location.path('/login');
			}
		}
	};

	angular.module("myApp").factory('userService', ['localStorageService', '$location', userService]);
}())
