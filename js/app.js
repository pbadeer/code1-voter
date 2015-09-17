angular.module("voter",['ngStorage', 'ngAnimate'])
.controller("main", function($scope, $localStorage, $http, $timeout) {
  // local storage
  $scope.$storage = $localStorage;

  // randomizer
  $scope.random = function(){
    return 0.5 - Math.random();
  };

  // get vote data
  $scope.votesUrl = 'https://32743319-600d-4520-a609-7510ec6ead66-bluemix:3de86a9ec9fc6d1f4d81e03f9a3e9b47fdc4235d23bf4d937027d046f99ec1b0@32743319-600d-4520-a609-7510ec6ead66-bluemix.cloudant.com/votes/_design/display/_view/getCount?limit=20&reduce=false';
  // $http.get(votesUrl).then(function(data){
  //   $scope.$storage.votesData = data;
  // }, function(e) {
  //   console.warn("Failed to retreive vote data", e);
  // });
  // [DELETE] the lines below and uncomment the $http above
  $scope.$storage.votesData = {"total_rows":3,"offset":0,"rows":[
    {"id":"+14022109127","key":"1","value":null},
    {"id":"32e05c5edba7db1fbe6068719eba4b7c","key":"1","value":null},
    {"id":"51beaafce83b6dbaa66f6502f55100a0","key":"2","value":null}
  ]};

  // get team info
  $scope.teamsUrl = 'http://32743319-600d-4520-a609-7510ec6ead66-bluemix:3de86a9ec9fc6d1f4d81e03f9a3e9b47fdc4235d23bf4d937027d046f99ec1b0@32743319-600d-4520-a609-7510ec6ead66-bluemix.cloudant.com/teams/_design/teamData/_view/new-view?limit=20&reduce=false';
  // $http.get(teamsUrl).then(function(data){
  //   $scope.$storage.teamsData = data;
  // }, function(e) {
  //   console.warn("Failed to retreive team data", e);
  // });
  // [DELETE] the lines below and uncomment the $http above
  $scope.$storage.teamsData = {"total_rows":12,"offset":0,"rows":[
    {"id":"TEAM2","key":"Smarty Pants","value":"http://www.cliparthut.com/clip-arts/765/smarty-pants-clip-art-765146.jpg"},
    {"id":"Team10","key":"Team 10","value":"http://static1.squarespace.com/static/5351bc09e4b03b169d834bb6/5424599be4b0ac0d5fc82f59/551316b6e4b01e0296eefd66/1427684934220/?format=1500w"},
    {"id":"Team11","key":"Team 11","value":"http://static1.squarespace.com/static/5351bc09e4b03b169d834bb6/5424599be4b0ac0d5fc82f59/551316b6e4b01e0296eefd66/1427684934220/?format=1500w"},
    {"id":"Team12","key":"Team 12","value":"http://static1.squarespace.com/static/5351bc09e4b03b169d834bb6/5424599be4b0ac0d5fc82f59/551316b6e4b01e0296eefd66/1427684934220/?format=1500w"},
    {"id":"Team4","key":"Team 4","value":"http://static1.squarespace.com/static/5351bc09e4b03b169d834bb6/5424599be4b0ac0d5fc82f59/551316b6e4b01e0296eefd66/1427684934220/?format=1500w"},
    {"id":"Team5","key":"Team 5","value":"http://static1.squarespace.com/static/5351bc09e4b03b169d834bb6/5424599be4b0ac0d5fc82f59/551316b6e4b01e0296eefd66/1427684934220/?format=1500w"},
    {"id":"Team6","key":"Team 6","value":"http://static1.squarespace.com/static/5351bc09e4b03b169d834bb6/5424599be4b0ac0d5fc82f59/551316b6e4b01e0296eefd66/1427684934220/?format=1500w"},
    {"id":"Team7","key":"Team 7","value":"http://static1.squarespace.com/static/5351bc09e4b03b169d834bb6/5424599be4b0ac0d5fc82f59/551316b6e4b01e0296eefd66/1427684934220/?format=1500w"},
    {"id":"Team8","key":"Team 8","value":"http://static1.squarespace.com/static/5351bc09e4b03b169d834bb6/5424599be4b0ac0d5fc82f59/551316b6e4b01e0296eefd66/1427684934220/?format=1500w"},
    {"id":"Team9","key":"Team 9","value":"http://static1.squarespace.com/static/5351bc09e4b03b169d834bb6/5424599be4b0ac0d5fc82f59/551316b6e4b01e0296eefd66/1427684934220/?format=1500w"},
    {"id":"TEAM1","key":"Team One","value":"http://www.teamonerealestate.com/team_one_real_estate/members/Team%20One%20Logo%20Best.jpg"},
    {"id":"TEAM3","key":"Wizards","value":"http://eduscapes.com/sessions/wizard/wizard.gif"}
  ]};

  // init votes
  if (!$scope.$storage.allMessages) {
    $scope.$storage.allMessages = [];

    // convert votes into totals
    for (var i = 0; i < $scope.$storage.votesData.rows.length; i++) {
      var vote = $scope.$storage.votesData.rows[i].key;
      if (!$scope.$storage.allMessages[vote]) {
        $scope.$storage.allMessages[vote] = 0;
      }
      $scope.$storage.allMessages[vote]++;
    }
  }

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
    var team = JSON.parse(event.data);
    if (!$scope.$storage.allMessages[team.Body]) {
      $scope.$storage.allMessages[team.Body] = 0;
    }
    $scope.$apply(function(){
      $scope.$storage.allMessages[team.Body] += 1;
    });
  };

  $scope.startTimer = function() {
    $scope.counter = setInterval($scope.timer, 1000);
  };
  $scope.resetTimer = function() {
    clearInterval($scope.counter);
    $scope.$storage.count = 60 * 3;
  };
  $scope.timer = function() {
    $scope.$apply(function(){
      $scope.$storage.count--;
      if ($scope.$storage.count <= 0) {
         clearInterval($scope.counter);
         return;
      }
    });
  };


  // If reloaded during countdown, resume it
  if ($scope.$storage.count && $scope.$storage.count != 60 * 3) {
    $scope.startTimer();
  } else {
    $scope.$storage.count = 60 * 3;
  }

  // If no stored top vote, find it
  if(!$scope.$storage.topVote) {
    $scope.findTopVote();
  }

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
