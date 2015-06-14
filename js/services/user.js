(function(){
	var userService = function (localStorageService) {
		return {
			storeUserToken: function(user_token){
				console.log('saving token ', user_token);
				localStorageService.set('user_token', user_token);
			},
			getUserToken: function(){
				var userToken = localStorageService.get('user_token');
				console.log('stored_token ', userToken);
			},
			storeUserId: function(user_id){
				console.log('saving user_id ', user_id);
				localStorageService.set('user_id', user_id);
			},
			getUserId: function(){
				var user_id = localStorageService.get('user_id');
				console.log('user_id ', user_id);
			}
		}
	};

	angular.module("myApp").factory('userService', ['localStorageService', userService]);
}())
