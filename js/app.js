/**
*  Module my app Module
*
* Description
*/
angular.module('myApp', [])
.controller('MainController',function ($scope, $timeout) {

	//Date object 
	$scope.date={};

	var updateTime = function(){
		$scope.date.raw=new Date();
		$timeout(updateTime, 1000);
	};

	updateTime();
})
.controller('ImagesController', function($scope){
	$scope.ImagesUrl=[];

	for (var i=0; i<20; i++)
	{
		if(i%3==0)
		{
			$scope.ImagesUrl.push('http://miriadna.com/desctopwalls/images/max/Ideal-landscape.jpg');
		}
		else if(i%3==1)
		{
			$scope.ImagesUrl.push('http://www.inewmedia.org/wp-content/uploads/2014/05/501ffaae9b1a0477f75898926fe0708c.jpg');
		}
		else if(i%3==2)
		{
			$scope.ImagesUrl.push('http://www.vacanzesenesi.it/wp-content/uploads/2014/05/vela.jpg');
		}
	}

	console.log("SECOND");
})
