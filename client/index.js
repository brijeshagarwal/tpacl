angular.module('TPACL', ['ngRoute'])
.config(tconfig)
.controller('tcontroller', tcontroller);

function tconfig($routeProvider, $locationProvider) {
  
  $locationProvider.html5Mode(true);

  $routeProvider
  .when("/", {
    templateUrl : "main.html",
    controller: "tcontroller"
  })
  .when("/teams", {
    templateUrl : "team.html",
    controller: "tcontroller"    
  });
}

function tcontroller($scope, $http) {

  $scope.player = {};
  $scope.selectedTeam = "";
  $scope.teams = [];

  $scope.currentBid = null;

  $scope.getPlayer = function(id) {
    $http.get(`/api/players/id/${id}`)
    .then(player => {
      $scope.player = player.data.success[0];
    });
  }

  $scope.getTeams = function() {
    $http.get('/api/teams?filter=%7B%22include%22%3A%20%22players%22%7D')
    .then(team => {
      $scope.teams = team.data
      $scope.teams.map(t => {
        t.leftBudget = t.budget;
        return t;
      })
    });
  }

  $scope.getPlayer("1");
  $scope.getTeams();

  $scope.isBidding = function (index) {
    const bid = $scope.currentBid ? $scope.currentBid + 100 : $scope.player.price;
    if (+$scope.selectedTeam.team_id === (index + 1)) return;
    if ($scope.teams[index].leftBudget - bid < 0) return;

    $scope.selectedTeam = $scope.teams[index];
    $scope.currentBid = bid;
    $scope.teams[index].budget =  $scope.teams[index].leftBudget - $scope.currentBid;
  }

}