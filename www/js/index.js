(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
*  Module my app Module
*
* Description
*/
/* global $scope, angular */

'use strict';

angular.module('myApp', ['ngRoute', 'LocalStorageModule', 'ngAnimate'])
.config(function($routeProvider){
	$routeProvider
	.when('/',
	{
		templateUrl:'../templates/main.html'
	})
	.when('/settings',
	{
		controller:'SettingsController',
		templateUrl:'../templates/settings.html'
	})
	.when('/login',
	{
		controller:'LoginController',
		templateUrl:'../templates/login.html'
	})
})
.directive('imageonload', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                $rootScope.$emit('rootScope:emit');
            });
        }
    };
})
.run(function($rootScope, $location, userService) {
    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      if ( !userService.checkIfUserIsAuthenticated()) {
        // no logged user, we should be going to #login
        if ( next.templateUrl == "login.html" ) {
          // already going to #login, no redirect needed
        } else {
          // not going to #login, we should redirect now
          $location.path( "/login" );
        }
      }         
    });
 })

},{}],2:[function(require,module,exports){
/* global angular */

'use strict';

(function(){

	var ImagesController = function ($scope, feedService, $rootScope, $timeout) {

		$scope.images_loaded = 0;
		$scope.display_images = false;
		$scope.ImagesUrl=[];
		//Date object 
		$scope.date={};

		var MAX_PHOTOS = 18;
		
		function getFeed(){
			feedService.getUserMedia().then(function(user_media_list){
				randomizeContent(user_media_list);
			});
		}

		function randomizeContent(user_media_list){
			var random_index;
			for (var i = 0; i < MAX_PHOTOS; i++) {
				random_index = Math.floor(Math.random()*user_media_list.length);
				$scope.ImagesUrl.push(user_media_list[random_index].images.standard_resolution.url);
				user_media_list.splice(random_index, 1);
			}

		}

		$rootScope.$on('rootScope:emit', function (event, data) {

			if ($scope.images_loaded < MAX_PHOTOS - 1) {
				$scope.images_loaded += 1;
			}
			else if ($scope.images_loaded === MAX_PHOTOS - 1) {
				$scope.display_images = true;
			}
		});

		getFeed();

		var updateTime = function(){
			$scope.date.raw=new Date();
			$timeout(updateTime, 1000);
		};

		updateTime(); 
	};

	ImagesController.$inject = ['$scope', 'feedService', '$rootScope', '$timeout'];

	angular.module('myApp').controller('ImagesController', ImagesController);

}());

},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
/* global angular */

'use strict';

(function(){

	var MainController = function ($scope, $timeout, $location, userService) {

		//Date object 
		$scope.date={};
		$scope.go = function ( path ) {
		  $location.path( path );
		};

		$scope.logout = function () {
			userService.logout();
		}

		var updateTime = function(){
			$scope.date.raw=new Date();
			$timeout(updateTime, 1000);
		};

		updateTime();
	};

	MainController.$inject = ['$scope', '$timeout', '$location', 'userService'];

	angular.module('myApp').controller('MainController', MainController);

}());

},{}],5:[function(require,module,exports){
/* global angular, authService, $scope */

'use strict';

(function(){

	var SettingsController = function ($scope,authService) {

		//initializing the authService
		
		authService.initialize();

		$scope.login = function () {
			authService.connectInstagram()
			.then(function(data) {
				$scope.user = data.user;
			})
		};
	}

	SettingsController.$inject = ['$scope', 'authService'];

	angular.module('myApp').controller('SettingsController', SettingsController);

}());

},{}],6:[function(require,module,exports){
/**
 * Index requiring all services and controllers
 */

/**
 * Main file
 */
require('./app.js');

/**
 * Controllers
 */
require('./controllers/mainCtrl.js');
require('./controllers/imagesCtrl.js');
require('./controllers/settingsCtrl.js');
require('./controllers/loginCtrl.js');

/**
 * Services
 */
require('./services/auth.js');
require('./services/user.js');
require('./services/feed.js');

/**
 * External libraries
 */
require('angular-local-storage');


},{"./app.js":1,"./controllers/imagesCtrl.js":2,"./controllers/loginCtrl.js":3,"./controllers/mainCtrl.js":4,"./controllers/settingsCtrl.js":5,"./services/auth.js":7,"./services/feed.js":8,"./services/user.js":9,"angular-local-storage":10}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
(function(){
	var feedService = function($q, $http, userService) {

		var instagramServerAPI = 'https://api.instagram.com/v1/',
			user_media_list = [],
			MAX_TIME_BEFORE_REFRESH = 1000*60*60*24; //1 day 

		return {
			getUserMedia: function() {

				var access_token = userService.getUserToken(),
					user_id = userService.getUserId(),
					endpoint = instagramServerAPI + 'users/' + user_id + '/media/recent?access_token=' + access_token + '&callback=JSON_CALLBACK&count=50',
					deferred = $q.defer(),
					date_last_access = Date.parse(userService.getCurrentUserTimestamp()),
					date_current_access = new Date(),
					last_user_feed = userService.getUserFeed();

				mixpanel.track('Load feed');

				function getRecentMedia (URL, count){
					$http.jsonp(URL.replace(/angular.callbacks._\d/,'JSON_CALLBACK')).success(function(response) {
						
						for (var i in response.data) {
							user_media_list.push(response.data[i]);
						}

						if (response.pagination.next_url && count <= 5 && user_media_list.length == 0) {
						   count = count + 1;
	                       getRecentMedia(response.pagination.next_url, count);
						}
						else {
							userService.storeUserFeed(user_media_list);
							userService.storeCurrentUserTimestamp();
							deferred.resolve(user_media_list);
						}
                	});
                }



                if (date_current_access - date_last_access < MAX_TIME_BEFORE_REFRESH && last_user_feed.length > 0)
                {
	                deferred.resolve(last_user_feed);
                }
                else
                {
                	getRecentMedia(endpoint, 0);
                }

				return deferred.promise;
			}
		}
	};

	angular.module('myApp').factory('feedService', ['$q', '$http', 'userService', feedService]);
}());

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
/**
 * An Angular module that gives you access to the browsers local storage
 * @version v0.2.2 - 2015-05-29
 * @link https://github.com/grevory/angular-local-storage
 * @author grevory <greg@gregpike.ca>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function ( window, angular, undefined ) {
/*jshint globalstrict:true*/
'use strict';

var isDefined = angular.isDefined,
  isUndefined = angular.isUndefined,
  isNumber = angular.isNumber,
  isObject = angular.isObject,
  isArray = angular.isArray,
  extend = angular.extend,
  toJson = angular.toJson;
var angularLocalStorage = angular.module('LocalStorageModule', []);

angularLocalStorage.provider('localStorageService', function() {

  // You should set a prefix to avoid overwriting any local storage variables from the rest of your app
  // e.g. localStorageServiceProvider.setPrefix('yourAppName');
  // With provider you can use config as this:
  // myApp.config(function (localStorageServiceProvider) {
  //    localStorageServiceProvider.prefix = 'yourAppName';
  // });
  this.prefix = 'ls';

  // You could change web storage type localstorage or sessionStorage
  this.storageType = 'localStorage';

  // Cookie options (usually in case of fallback)
  // expiry = Number of days before cookies expire // 0 = Does not expire
  // path = The web path the cookie represents
  this.cookie = {
    expiry: 30,
    path: '/'
  };

  // Send signals for each of the following actions?
  this.notify = {
    setItem: true,
    removeItem: false
  };

  // Setter for the prefix
  this.setPrefix = function(prefix) {
    this.prefix = prefix;
    return this;
  };

   // Setter for the storageType
   this.setStorageType = function(storageType) {
     this.storageType = storageType;
     return this;
   };

  // Setter for cookie config
  this.setStorageCookie = function(exp, path) {
    this.cookie.expiry = exp;
    this.cookie.path = path;
    return this;
  };

  // Setter for cookie domain
  this.setStorageCookieDomain = function(domain) {
    this.cookie.domain = domain;
    return this;
  };

  // Setter for notification config
  // itemSet & itemRemove should be booleans
  this.setNotify = function(itemSet, itemRemove) {
    this.notify = {
      setItem: itemSet,
      removeItem: itemRemove
    };
    return this;
  };

  this.$get = ['$rootScope', '$window', '$document', '$parse', function($rootScope, $window, $document, $parse) {
    var self = this;
    var prefix = self.prefix;
    var cookie = self.cookie;
    var notify = self.notify;
    var storageType = self.storageType;
    var webStorage;

    // When Angular's $document is not available
    if (!$document) {
      $document = document;
    } else if ($document[0]) {
      $document = $document[0];
    }

    // If there is a prefix set in the config lets use that with an appended period for readability
    if (prefix.substr(-1) !== '.') {
      prefix = !!prefix ? prefix + '.' : '';
    }
    var deriveQualifiedKey = function(key) {
      return prefix + key;
    };
    // Checks the browser to see if local storage is supported
    var browserSupportsLocalStorage = (function () {
      try {
        var supported = (storageType in $window && $window[storageType] !== null);

        // When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage
        // is available, but trying to call .setItem throws an exception.
        //
        // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage
        // that exceeded the quota."
        var key = deriveQualifiedKey('__' + Math.round(Math.random() * 1e7));
        if (supported) {
          webStorage = $window[storageType];
          webStorage.setItem(key, '');
          webStorage.removeItem(key);
        }

        return supported;
      } catch (e) {
        storageType = 'cookie';
        $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
        return false;
      }
    }());

    // Directly adds a value to local storage
    // If local storage is not available in the browser use cookies
    // Example use: localStorageService.add('library','angular');
    var addToLocalStorage = function (key, value) {
      // Let's convert undefined values to null to get the value consistent
      if (isUndefined(value)) {
        value = null;
      } else {
        value = toJson(value);
      }

      // If this browser does not support local storage use cookies
      if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
        if (!browserSupportsLocalStorage) {
            $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
        }

        if (notify.setItem) {
          $rootScope.$broadcast('LocalStorageModule.notification.setitem', {key: key, newvalue: value, storageType: 'cookie'});
        }
        return addToCookies(key, value);
      }

      try {
        if (webStorage) {webStorage.setItem(deriveQualifiedKey(key), value)};
        if (notify.setItem) {
          $rootScope.$broadcast('LocalStorageModule.notification.setitem', {key: key, newvalue: value, storageType: self.storageType});
        }
      } catch (e) {
        $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
        return addToCookies(key, value);
      }
      return true;
    };

    // Directly get a value from local storage
    // Example use: localStorageService.get('library'); // returns 'angular'
    var getFromLocalStorage = function (key) {

      if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
        if (!browserSupportsLocalStorage) {
          $rootScope.$broadcast('LocalStorageModule.notification.warning','LOCAL_STORAGE_NOT_SUPPORTED');
        }

        return getFromCookies(key);
      }

      var item = webStorage ? webStorage.getItem(deriveQualifiedKey(key)) : null;
      // angular.toJson will convert null to 'null', so a proper conversion is needed
      // FIXME not a perfect solution, since a valid 'null' string can't be stored
      if (!item || item === 'null') {
        return null;
      }

      try {
        return JSON.parse(item);
      } catch (e) {
        return item;
      }
    };

    // Remove an item from local storage
    // Example use: localStorageService.remove('library'); // removes the key/value pair of library='angular'
    var removeFromLocalStorage = function () {
      var i, key;
      for (i=0; i<arguments.length; i++) {
        key = arguments[i];
        if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
          if (!browserSupportsLocalStorage) {
            $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
          }

          if (notify.removeItem) {
            $rootScope.$broadcast('LocalStorageModule.notification.removeitem', {key: key, storageType: 'cookie'});
          }
          removeFromCookies(key);
        }
        else {
          try {
            webStorage.removeItem(deriveQualifiedKey(key));
            if (notify.removeItem) {
              $rootScope.$broadcast('LocalStorageModule.notification.removeitem', {
                key: key,
                storageType: self.storageType
              });
            }
          } catch (e) {
            $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
            removeFromCookies(key);
          }
        }
      }
    };

    // Return array of keys for local storage
    // Example use: var keys = localStorageService.keys()
    var getKeysForLocalStorage = function () {

      if (!browserSupportsLocalStorage) {
        $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
        return false;
      }

      var prefixLength = prefix.length;
      var keys = [];
      for (var key in webStorage) {
        // Only return keys that are for this app
        if (key.substr(0,prefixLength) === prefix) {
          try {
            keys.push(key.substr(prefixLength));
          } catch (e) {
            $rootScope.$broadcast('LocalStorageModule.notification.error', e.Description);
            return [];
          }
        }
      }
      return keys;
    };

    // Remove all data for this app from local storage
    // Also optionally takes a regular expression string and removes the matching key-value pairs
    // Example use: localStorageService.clearAll();
    // Should be used mostly for development purposes
    var clearAllFromLocalStorage = function (regularExpression) {

      // Setting both regular expressions independently
      // Empty strings result in catchall RegExp
      var prefixRegex = !!prefix ? new RegExp('^' + prefix) : new RegExp();
      var testRegex = !!regularExpression ? new RegExp(regularExpression) : new RegExp();

      if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
        if (!browserSupportsLocalStorage) {
          $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
        }
        return clearAllFromCookies();
      }

      var prefixLength = prefix.length;

      for (var key in webStorage) {
        // Only remove items that are for this app and match the regular expression
        if (prefixRegex.test(key) && testRegex.test(key.substr(prefixLength))) {
          try {
            removeFromLocalStorage(key.substr(prefixLength));
          } catch (e) {
            $rootScope.$broadcast('LocalStorageModule.notification.error',e.message);
            return clearAllFromCookies();
          }
        }
      }
      return true;
    };

    // Checks the browser to see if cookies are supported
    var browserSupportsCookies = (function() {
      try {
        return $window.navigator.cookieEnabled ||
          ("cookie" in $document && ($document.cookie.length > 0 ||
          ($document.cookie = "test").indexOf.call($document.cookie, "test") > -1));
      } catch (e) {
          $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
          return false;
      }
    }());

    // Directly adds a value to cookies
    // Typically used as a fallback is local storage is not available in the browser
    // Example use: localStorageService.cookie.add('library','angular');
    var addToCookies = function (key, value, daysToExpiry) {

      if (isUndefined(value)) {
        return false;
      } else if(isArray(value) || isObject(value)) {
        value = toJson(value);
      }

      if (!browserSupportsCookies) {
        $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
        return false;
      }

      try {
        var expiry = '',
            expiryDate = new Date(),
            cookieDomain = '';

        if (value === null) {
          // Mark that the cookie has expired one day ago
          expiryDate.setTime(expiryDate.getTime() + (-1 * 24 * 60 * 60 * 1000));
          expiry = "; expires=" + expiryDate.toGMTString();
          value = '';
        } else if (isNumber(daysToExpiry) && daysToExpiry !== 0) {
          expiryDate.setTime(expiryDate.getTime() + (daysToExpiry * 24 * 60 * 60 * 1000));
          expiry = "; expires=" + expiryDate.toGMTString();
        } else if (cookie.expiry !== 0) {
          expiryDate.setTime(expiryDate.getTime() + (cookie.expiry * 24 * 60 * 60 * 1000));
          expiry = "; expires=" + expiryDate.toGMTString();
        }
        if (!!key) {
          var cookiePath = "; path=" + cookie.path;
          if(cookie.domain){
            cookieDomain = "; domain=" + cookie.domain;
          }
          $document.cookie = deriveQualifiedKey(key) + "=" + encodeURIComponent(value) + expiry + cookiePath + cookieDomain;
        }
      } catch (e) {
        $rootScope.$broadcast('LocalStorageModule.notification.error',e.message);
        return false;
      }
      return true;
    };

    // Directly get a value from a cookie
    // Example use: localStorageService.cookie.get('library'); // returns 'angular'
    var getFromCookies = function (key) {
      if (!browserSupportsCookies) {
        $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
        return false;
      }

      var cookies = $document.cookie && $document.cookie.split(';') || [];
      for(var i=0; i < cookies.length; i++) {
        var thisCookie = cookies[i];
        while (thisCookie.charAt(0) === ' ') {
          thisCookie = thisCookie.substring(1,thisCookie.length);
        }
        if (thisCookie.indexOf(deriveQualifiedKey(key) + '=') === 0) {
          var storedValues = decodeURIComponent(thisCookie.substring(prefix.length + key.length + 1, thisCookie.length))
          try {
            return JSON.parse(storedValues);
          } catch(e) {
            return storedValues
          }
        }
      }
      return null;
    };

    var removeFromCookies = function (key) {
      addToCookies(key,null);
    };

    var clearAllFromCookies = function () {
      var thisCookie = null, thisKey = null;
      var prefixLength = prefix.length;
      var cookies = $document.cookie.split(';');
      for(var i = 0; i < cookies.length; i++) {
        thisCookie = cookies[i];

        while (thisCookie.charAt(0) === ' ') {
          thisCookie = thisCookie.substring(1, thisCookie.length);
        }

        var key = thisCookie.substring(prefixLength, thisCookie.indexOf('='));
        removeFromCookies(key);
      }
    };

    var getStorageType = function() {
      return storageType;
    };

    // Add a listener on scope variable to save its changes to local storage
    // Return a function which when called cancels binding
    var bindToScope = function(scope, key, def, lsKey) {
      lsKey = lsKey || key;
      var value = getFromLocalStorage(lsKey);

      if (value === null && isDefined(def)) {
        value = def;
      } else if (isObject(value) && isObject(def)) {
        value = extend(def, value);
      }

      $parse(key).assign(scope, value);

      return scope.$watch(key, function(newVal) {
        addToLocalStorage(lsKey, newVal);
      }, isObject(scope[key]));
    };

    // Return localStorageService.length
    // ignore keys that not owned
    var lengthOfLocalStorage = function() {
      var count = 0;
      var storage = $window[storageType];
      for(var i = 0; i < storage.length; i++) {
        if(storage.key(i).indexOf(prefix) === 0 ) {
          count++;
        }
      }
      return count;
    };

    return {
      isSupported: browserSupportsLocalStorage,
      getStorageType: getStorageType,
      set: addToLocalStorage,
      add: addToLocalStorage, //DEPRECATED
      get: getFromLocalStorage,
      keys: getKeysForLocalStorage,
      remove: removeFromLocalStorage,
      clearAll: clearAllFromLocalStorage,
      bind: bindToScope,
      deriveKey: deriveQualifiedKey,
      length: lengthOfLocalStorage,
      cookie: {
        isSupported: browserSupportsCookies,
        set: addToCookies,
        add: addToCookies, //DEPRECATED
        get: getFromCookies,
        remove: removeFromCookies,
        clearAll: clearAllFromCookies
      }
    };
  }];
});
})( window, window.angular );
},{}]},{},[6])