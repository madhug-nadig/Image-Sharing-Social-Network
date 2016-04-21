(function(){
	angular.module('dixpix')
		.controller('NavbarController', ['$window','$rootScope','$scope', '$state' , '$http' , function($window,$rootScope ,$scope, $state, $http){
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
				$window.location.reload();
			}).error(function(err){
				console.log(err);
			})
		}
		}]);
}());