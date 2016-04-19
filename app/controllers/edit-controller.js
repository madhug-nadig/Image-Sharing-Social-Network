(function(){
	angular.module('dixpix')
		.controller('EditController', ['Upload','$rootScope','$scope', '$state' , '$http' , function(Upload,$rootScope ,$scope, $state, $http){
			
			$scope.identification = JSON.parse(localStorage['userData']);

			$scope.$watch(function(){
				return $scope.file;
			}, function(){
				$scope.upload($scope.file);
			});

			$scope.upload = function(file){
				if(file){
					Upload.upload({
						url: '/users/edit',
						method: 'POST',
						data:{username: $scope.identification.username, token: $scope.identification.token},
						file: file
					}).progress(function(event){
						console.log('uploading the image');
					}).success(function(data){
						var a = $scope.identification;
						a.image = data;
						localStorage.setItem('userData', JSON.stringify(a));
					}).error(function(err){
						console.log(err);
					})
				}
			};

			$scope.updateBio = function(){
				var request = {
					username: $scope.identification.username,
					bio: $scope.user.bio,
					token: $scope.identification.token
				};
				console.log($scope.identification.username);
				$http.post('/users/edit/updatebio', request).success(function(response){
					console.log("Success");
				}).error(function(err){
					console.log("Fail");
				});
			};

		}]);
}());