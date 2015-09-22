angular.module("voter",['ngStorage', 'ngAnimate'])
.controller("main", function($scope, $localStorage, $http, $timeout) {
  // local storage
  $scope.$storage = $localStorage;
  $scope.totalVotes = 0;

 /* $scope.shuffleArray = function(array) {
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
	};
*/

  // get vote data
   $scope.votesUrl = 'http://32743319-600d-4520-a609-7510ec6ead66-bluemix:3de86a9ec9fc6d1f4d81e03f9a3e9b47fdc4235d23bf4d937027d046f99ec1b0@32743319-600d-4520-a609-7510ec6ead66-bluemix.cloudant.com/votes/_design/display/_view/getCount?limit=20&reduce=false';
   //$scope.votesURL = 'http://32743319-600d-4520-a609-7510ec6ead66-bluemix.cloudant.com/votes/_design/display/_view/getCount?limit=20&reduce=false';
   $http.get($scope.votesUrl).then(function(res){
    $scope.$storage.allMessages = [];
    $scope.totalVotes = res.data.total_rows;
     $scope.$storage.votesData = res.data;
 	  for (var i = 0; i < res.data.rows.length; i++) {
      	var vote = res.data.rows[i].key;
      	if (!$scope.$storage.allMessages[vote]) {
        	$scope.$storage.allMessages[vote] = 0;
      	}
      	$scope.$storage.allMessages[vote]++;
      	//$scope.$storage.allMessagesShuffled = $scope.shuffleArray($scope.$storage.allMessages);
     }
    $scope.findTopVote();
   }, function(e) {
     console.warn("Failed to retreive vote data", e);
   });

  // get team info
   $scope.teamsUrl = 'https://32743319-600d-4520-a609-7510ec6ead66-bluemix.cloudant.com/teams/_design/teamData/_view/new-view?limit=50&reduce=false';
   $http.get($scope.teamsUrl).then(function(res){
     $scope.$storage.teamsData = res.data;
   }, function(e) {
     console.warn("Failed to retreive team data", e);
   });

  // highest vote
  $scope.findTopVote = function() {
    var i = $scope.$storage.allMessages.length;
    var topVote = 0;
    var topTeam = 0;
    while (i--) {
      if ($scope.$storage.allMessages[i] > topVote) {
        topVote = $scope.$storage.allMessages[i];
        topTeam = i;
      }
    }
    $scope.$storage.topVote = topVote;
    $scope.$storage.topTeam = topTeam;
  };

  // live vote updating
  $scope.webSocket = new WebSocket("ws://etg-vote.mybluemix.net/ws/newVote");

  $scope.webSocket.onmessage = function(event) {
    console.log(event.data);
    $scope.totalVotes++;
    var team = JSON.parse(event.data);
    if (!$scope.$storage.allMessages[team.Body]) {
      $scope.$storage.allMessages[team.Body] = 0;
    }
    $scope.$apply(function(){
      $scope.$storage.allMessages[team.Body] += 1;
      //$scope.$storage.allMessagesShuffled = $scope.shuffleArray($scope.$storage.allMessages);
      $scope.findTopVote();
    });
  };

  $scope.webSocket.onopen = function () {
  	console.log("socket is open and subscribed to the server.");
  };
  $scope.webSocket.onerror = function (error) {
  	console.log("an error occured with the websocket " + error);
  };
  $scope.webSocket.onclose = function() {
  	console.log("the socket is now closed.");
  	//can we reopen the socket ??
  };




  $scope.winner = false;
  $scope.stage1 = false;
  $scope.stage2 = false;
  $scope.stage3 = false;
  $scope.revealWinner = function(){
    $scope.findTopVote();
    $scope.winner = true;
    $timeout(function(){$scope.stage1 = true}, 2500);
    $timeout(function(){$scope.stage2 = true}, 4500);
    $timeout(function(){$scope.stage3 = true}, 5500);
  };
});
