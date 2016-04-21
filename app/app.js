(function(){
	angular.module('dixpix', ['ui.router', 'ngFileUpload'])
		.config(function($stateProvider, $urlRouterProvider){
			$urlRouterProvider.otherwise('/');

			$stateProvider
				.state('signUp', {
					url : '/signup',
					templateUrl : 'app/templates/signup.html',
					controller: "SignUpController"
			})
				.state('logIn', {
					url : '/login',
					templateUrl : 'app/templates/login.html',
					controller: "LogInController"
			})
				.state('editProfile', {
					url : '/edit',
					templateUrl : 'app/templates/edit-profile.html',
					controller: "EditController"
			})
				.state('profile', {
					url: '/',
					templateUrl:'app/templates/profile.html',
					controller: 'ProfileController'
			})
				.state('follow', {
					url: '/follow-users',
					templateUrl:'app/templates/follow.html',
					controller: 'FollowController'
				})
		});
}());