
/*
jobFactory fetches array of jobs returns it.
*/
angular.module('myApp')
.factory("jobFactory", ['$http','$rootScope', function($http, $rootScope){
	return {
		get: function() { 
			return $http.get($rootScope.url + 'jobs/jobs.json').then(function(response){
			// return $http.get('https://s3.eu-central-1.amazonaws.com/jobgame/jobs/jobs.json').then(function(response){
				return response.data;
			});
		}
	}
}]);


