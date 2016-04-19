(function(){
	angular.module('dixpix')
		.controller('SignUpController', ['$rootScope','$scope', '$state' , '$http' , function($rootScope ,$scope, $state, $http){
			if(localStorage['isUser']){
						$rootScope.loggedIn = true;
					}
					else{
						$scope.loggedIn = false;
					}


			$scope.newuser = function(){
				console.log($scope.newUser);
				$http.post('/users/register', $scope.newUser).success(function(response){
					console.log(response.status);
					$scope.isError = false;
				}).error(function(err){
					console.log(err.err);
					$scope.isError = true;
					$scope.errorM = err.err.message;
				});
			}
		}]);
}());