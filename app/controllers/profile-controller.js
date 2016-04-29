(function(){
	angular.module('dixpix')
		.controller('ProfileController', ['Upload','$rootScope','$scope' , '$http' , function(Upload,$rootScope ,$scope, $http){
				if(localStorage['userData'])
						$scope.identification = JSON.parse(localStorage['userData']);

			$scope.$watch(function(){
				return $scope.file;
			}, function(){
				$scope.sendPhoto($scope.file);
			});

			$scope.sendPhoto = function(file){
				if(file){
					Upload.upload({
						url: '/users/addphoto',
						method: 'POST',
						data:{username: $scope.identification.username, token: $scope.identification.token, image: $scope.identification.image},
						file: file
					}).progress(function(event){
						console.log('uploading the image');
					}).success(function(data){
						console.log(data);
					}).error(function(err){
						console.log(err);
					})
				}
			};

			$scope.getPhotos = function(){
				if($scope.identification){
					flng = angular.copy($scope.identification.following);
					flng.push($scope.identification.username);
					var data = {username: $scope.identification.username, token: $scope.identification.token, following: flng}
				
				$http.post('/users/getphotos', data).success(function(response){
					console.log(response);
					$scope.photos = response;
				});
				}
			}
		}]);
}());