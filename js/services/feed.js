(function(){
	var feedService = function($q, $http, userService) {

		var instagramServerAPI = 'https://api.instagram.com/v1/',
			user_media_list = [];


		return {
			getUserMedia: function() {

				var access_token = userService.getUserToken(),
					user_id = userService.getUserId(),
					endpoint = instagramServerAPI + 'users/' + user_id + '/media/recent?access_token=' + access_token + '&callback=JSON_CALLBACK&count=50',
					deferred = $q.defer();


				function getRecentMedia (URL, count){
					console.log('chiamata con...' + URL + '...');
					$http.jsonp(URL.replace(/angular.callbacks._\d/,'JSON_CALLBACK')).success(function(response) {
						console.log('response', response);
						
						for (var i in response.data) {
							user_media_list.push(response.data[i]);
						}

						if (response.pagination.next_url && count <= 5) {
						   console.log('An ' + count + ' ' + response.pagination.next_url);
						   count = count + 1;
	                       getRecentMedia(response.pagination.next_url, count);
						}
						else {
							console.log('Risolvo la promise con ', user_media_list)
							deferred.resolve(user_media_list);
						}
                	});
                }

                getRecentMedia(endpoint, 0);

				return deferred.promise;
			}
		}
	};

	angular.module('myApp').factory('feedService', ['$q', '$http', 'userService', feedService]);
}());
