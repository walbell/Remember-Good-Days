'use strict';


(function(){

	var authService = function($q,userService)
	{
		var authorizationResult = false;

		return {
	        initialize: function() {
	            //initialize OAuth.io with public key of the application
	            OAuth.initialize('N38Qi-7TSSlfl5q7iqRW2FteG8E', {cache:true});
	            //try to create an authorization result when the page loads, this means a returning user won't have to click the twitter button again
	            authorizationResult = OAuth.create('facebook');
	        },
	        isReady: function() {
	            return (authorizationResult);
	        },
	        connectFacebook: function() {

	        	var user={};

	            var deferred = $q.defer();
				OAuth.popup('facebook',{cache:true}).done(function(result) {
				    // do some stuff with result
				    console.log("result");
					console.log(result);

					user.oauth_token=result.oauth_token;
					user.oauth_token_secret=result.oauth_token_secret;

				    result.me().done(function(data) {
					    // do something with `data`, e.g. print data.name
					    
					    // console.log("user data");
					    // console.log(data);
					    // user.id=data.id;
					    // user.nickname=data.alias;
					    // user.name=data.name;
					    // user.bio=data.bio;
					    // user.profileImgUrl=data.avatar.replace("_normal", "");

					    // console.log("user to upload");
					    // console.log(user);
					    
					})
				})
				
	            return deferred.promise;
	        },
	        clearCache: function() {
	            OAuth.clearCache('facebook');
	            authorizationResult = false;
	            userService.logOut();
	        },
	        getLatestTweets: function () {
	            //create a deferred object using Angular's $q service
	            var deferred = $q.defer();
	            var promise = authorizationResult.get('/1.1/statuses/home_timeline.json').done(function(data) {
	                //when the data is retrieved resolved the deferred object
	                deferred.resolve(data)
	            });
	            //return the promise of the deferred object
	            return deferred.promise;
	        }
    	}

	};

	angular.module("myApp").factory('authService', ['$q','userService',authService]);

}())
