(function(){
	var feedService = function($q, $http, userService) {

		var instagramServerAPI = 'https://api.instagram.com/v1/';

		return {
			getUserMedia: function() {

				var access_token = userService.getUserToken(),
					endpoint = instagramServerAPI + 'users/49267726/media/recent?access_token=49267726.6e1a144.c41faeb4d5d446f2ba1e49a0fec0a1e0&callback=JSON_CALLBACK',
					deferred = $q.defer();

				console.log('endpoint is ' + endpoint); 

				$http.jsonp(endpoint).success(function(response) {
                       console.log('response ', response);
                       deferred.resolve(response);
                	});

				return deferred.promise;
			}
		}
	};

	angular.module('myApp').factory('feedService', ['$q', '$http', 'userService', feedService]);
}());
