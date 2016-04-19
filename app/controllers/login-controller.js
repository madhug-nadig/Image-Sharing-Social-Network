(function(){
	angular.module('dixpix')
		.controller('LogInController', ['$rootScope','$scope', '$state' , '$http' , function($rootScope, $scope, $state, $http){
			if(localStorage['userData']){
						$rootScope.loggedIn = true;
					}
					else{
						$rootScope.loggedIn = false;
					}


			$scope.login = function(){
				$http.post('/users/login', $scope.user).success(function(response){
					console.log(response.status);
					localStorage.setItem('userData', JSON.stringify(response));
					console.log(response.username);
					$rootScope.loggedIn = true;
					$scope.isError = false;
				}).error(function(err){
					console.log(err.err);
					$scope.isError = true;
					$scope.errorM = err.err.message;				
				});
			}
		}]);
}());