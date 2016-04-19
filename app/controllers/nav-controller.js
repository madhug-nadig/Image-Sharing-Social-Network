(function(){
	angular.module('dixpix')
		.controller('NavbarController', ['$rootScope','$scope', '$state' , '$http' , function($rootScope ,$scope, $state, $http){
			if(localStorage['userData']){
						$rootScope.loggedIn = true;
					}
					else{
						$rootScope.loggedIn = false;
					}

		$scope.logOut = function(){
			localStorage.clear();
			$rootScope.loggedIn = false;
			$http.get('/users/logout').success(function(response){
				console.log(response);
			}).error(function(err){
				console.log(err);
			})

		}
		}]);
}());