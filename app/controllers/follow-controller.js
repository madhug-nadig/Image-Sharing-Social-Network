(function(){
	angular.module('dixpix')
		.controller('FollowController', ['$rootScope','$scope', '$state' , '$http' , function($rootScope ,$scope, $state, $http){

			$scope.identification = JSON.parse(localStorage['userData']);

			$http.get('/users/get').then(function(response){
				$scope.users = response.data;
				console.log($scope.users);
			})
		$scope.follow = function(followed_username){
			data = {
				followed_username: followed_username,
				follower_username: $scope.identification.username,
				token: $scope.identification.token
			};

			$http.post('/users/follow', data).then(function(){
				console.log("following " + followed_username);
			});
		}

		$scope.isFollow = function(usn){
			for(x =0; x < $scope.identification.following.length; x++){
				if($scope.identification.following[x].username === usn){
					return true;
				}
			}
			return false;
		}
		}]);
}());