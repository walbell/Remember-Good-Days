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
				console.log($scope.images_loaded);
			}
			else if ($scope.images_loaded === MAX_PHOTOS - 1) {
				console.log('images loaded');
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
