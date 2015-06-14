/* global angular */

'use strict';

(function(){

	var ImagesController = function ($scope, feedService) {

		$scope.ImagesUrl=[];

		// for (var i=0; i<20; i++)
		// {
		// 	if(i%3 === 0)
		// 	{
		// 		$scope.ImagesUrl.push('http://miriadna.com/desctopwalls/images/max/Ideal-landscape.jpg');
		// 	}
		// 	else if(i%3 === 1)
		// 	{
		// 		$scope.ImagesUrl.push('http://www.inewmedia.org/wp-content/uploads/2014/05/501ffaae9b1a0477f75898926fe0708c.jpg');
		// 	}
		// 	else if(i%3 === 2)
		// 	{
		// 		$scope.ImagesUrl.push('http://www.vacanzesenesi.it/wp-content/uploads/2014/05/vela.jpg');
		// 	}
		// }

		// console.log('SECOND');
		
		function getFeed(){
			feedService.getUserMedia().then(function(data){
				console.log('from the ImagesController', data);

				$scope.$watch('ImagesUrl', function() {
					for (var i in data.data) {
					console.log(data.data[i].images.standard_resolution);
					$scope.ImagesUrl.push(data.data[i].images.standard_resolution.url);
				}
				});
			});
		}

		getFeed(); 
	};

	ImagesController.$inject = ['$scope', 'feedService'];

	angular.module('myApp').controller('ImagesController', ImagesController);

}());
