/**
*  Module my app Module
*
* Description
*/
// global $scope

'use strict';

// var app=angular.module('customersApp',['ngRoute']);
//     app.config(function($routeProvider)
//     {
//                $routeProvider
//                .when('/',
//                 {
//                     controller:'customersController',
//                     templateUrl: 'app/views/customers.html'
//                 })
//                .when('/orders/:customerId',
//                 {
//                     controller:'ordersController',
//                     templateUrl:'app/views/orders.html'
//                 })
//                 .otherwise({ redirectTo: '/' });
//     });

angular.module('myApp', ['ngRoute'])
.config(function($routeProvider){
	$routeProvider
	.when('/',
	{
		controller:'ImagesController',
		templateUrl:'../templates/main.html'
	})
	.when('/settings',
	{
		controller:'SettingsController',
		templateUrl:'../templates/settings.html'
	})
})
.controller('MainController',function ($scope, $timeout, $location) {

	//Date object 
	$scope.date={};
	$scope.go = function ( path ) {
      console.log(path);
	  $location.path( path );
	};

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
		if(i%3 === 0)
		{
			$scope.ImagesUrl.push('http://miriadna.com/desctopwalls/images/max/Ideal-landscape.jpg');
		}
		else if(i%3 === 1)
		{
			$scope.ImagesUrl.push('http://www.inewmedia.org/wp-content/uploads/2014/05/501ffaae9b1a0477f75898926fe0708c.jpg');
		}
		else if(i%3 === 2)
		{
			$scope.ImagesUrl.push('http://www.vacanzesenesi.it/wp-content/uploads/2014/05/vela.jpg');
		}
	}

	console.log("SECOND");
})
.controller('SettingsController', function($scope){
	console.log("IN settings controller");
})
