/* global angular */

'use strict';

(function(){

	var ImagesController = function ($scope, feedService) {

		console.log('IMAGES ImagesController');

		$scope.ImagesUrl=[];
		
		function getFeed(){
			feedService.getUserMedia().then(function(user_media_list){
				for (var i in user_media_list) {
					$scope.ImagesUrl.push(user_media_list[i].images.standard_resolution.url);
				}
			});
		}

		getFeed(); 
	};

	ImagesController.$inject = ['$scope', 'feedService'];

	angular.module('myApp').controller('ImagesController', ImagesController);

}());
