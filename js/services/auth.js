/* global OAuth */
 
'use strict';


(function(){

	var authService = function($q, userService)
	{
		var authorizationResult = false;

		return {
	        initialize: function() {
	            //initialize OAuth.io with public key of the application
	            OAuth.initialize('olAW_9TEYY-sIGtWJOMyMMxXLCM');
	            //try to create an authorization result when the page loads, this means a returning user won't have to click the twitter button again
	            authorizationResult = OAuth.create('instagram');
	        },
	        isReady: function() {
	            return (authorizationResult);
	        },
	        connectInstagram: function() {

	        	var deferred = $q.defer();

				OAuth.popup('instagram').done(function(result) {
					userService.storeUserToken(result.access_token);
					userService.storeUserId(result.user.id);
					deferred.resolve(result);
				});

				return deferred.promise;
				
	        },
	        clearCache: function() {
	            OAuth.clearCache('instagram');
	            authorizationResult = false;
	        },
	        getLatestTweets: function () {
	            //create a deferred object using Angular's $q service
	            var deferred = $q.defer();
	            var promise = authorizationResult.get('/1.1/statuses/home_timeline.json').done(function(data) {
	                //when the data is retrieved resolved the deferred object
	                deferred.resolve(data);
	            });
	            //return the promise of the deferred object
	            return deferred.promise;
	        }
    	}

	};

	angular.module("myApp").factory('authService', ['$q', 'userService', authService]);

}())
