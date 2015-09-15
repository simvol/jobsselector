/*
	Author: Evgeny Makarov
	Date: August 2015
	Description: Application displays two jobs (title + img + description). User chooses one by clicking.
		User keep chosing until there only one job left
*/


'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
])
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])
.controller('gameCtrl', ['$scope', 'jobFactory','$rootScope', function($scope, jobFactory, $rootScope) {
	$rootScope.url = $scope.url = 'https://s3.eu-central-1.amazonaws.com/jobgame/';
	
	var allJobs = [];

	//alljobs are going to be split into 2 arrays
	var jobs = [];

	//save number of pairs
	var pairLength;

	//promise gets array with alljobs
	jobFactory.get().then(function(response){

		// array with all jobs (will change during the game)
		allJobs = response;

		if(allJobs.length > 0){
			startRound(allJobs);
		        allJobs = redefineJobs(allJobs);
		} else {
			alert("Sorry. something went wrong, there's no jobs to play with... Go with your heart!");
		}

	},
	function(error){
		console.log("error: "  + error);
	});

	function startRound(allJobs){
		//display how many jobs there in total in each round
		$scope.jobsLeft = allJobs.length;

		// getting two arrays of jobs (first and second parts)
		jobs = splitInHalves( allJobs );

		//if there's a pair of jobs - keep playing
		if (jobs.length === 2) {

			//saved length of pairs to go through
			//variable used to define when all pair were shown
			pairLength = jobs[1].length;

			//restar showing paris from beginning
			$scope.pairNo = 0;
	
			showPairs($scope.pairNo);

		//if there's only ony job left - display the result
		} else {
			$("#container").html("<h1 class='alert alert-info'>Твоя судьба, брат мой, быть лучшим " 
				+ jobs[0].title
				+ " в истории. Поздравляю тебя! Теперь ты знаешь, что надо делать!</h1>");
		}
	
		
	}

	//clear the array to repopulate it later with jobs chosen by the user
	// allJobs = [];
//	allJobs = redefineJobs(allJobs);

	// repopulate allJobs with selected by user jobs
	$scope.sendChoice = function (ch) {

		// ch 0 or 1
		allJobs.push( jobs[ch][$scope.pairNo] );

		console.log('saved: ' + jobs[ch][$scope.pairNo]);

		//change number of pairs to show
		$scope.pairNo++;

		//show pairs
		showPairs($scope.pairNo);
		


		//we went through all pairs and saved new allJobs
		if ( allJobs.length === pairLength ) {
			
			//start new round 
			startRound(allJobs);
			
			allJobs = redefineJobs(allJobs);

		}
	}

	function showPairs(pairNo){
		$scope.fjob = jobs[0][pairNo];
		$scope.sjob = jobs[1][pairNo];
	}

}]);

//if number of all jobs is odd, istead of clearing all jobs to repopulate if user's choise
//we should save the last job
function redefineJobs(allJobs){
	//if number of jobs is even clear all jobs
	if (allJobs.length % 2 === 0){
		allJobs = [];

	//otherwise save the last job
	} else {
		var lstJob = allJobs[allJobs.length - 1];
		allJobs = [];
		allJobs.push(lstJob); 
	}
	
	return allJobs;
}



// split passed list of all jobs into two halves
// clears passed array
// returns array of 2 parts of the jobs list
function splitInHalves(list) {
	//cheking if there's more than one job in the list
	if (list.length > 1) {

		//shuffle the order
		list = shuffle(list);

		// first jobs - first half of all jobs
		var fjobs = list.slice(0, list.length / 2);
		
		// second jobs - second half of all jobs
		var sjobs = list.slice(list.length / 2 );

		//this supposed to clear both current and original array, but it doesn't....
		list = [];

		return [fjobs, sjobs];

	//if there's only one job - just return it back, prentending this function did something
	} else {
		return list;
	}
}

//shuffle the array and return back
//the function taken from: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
