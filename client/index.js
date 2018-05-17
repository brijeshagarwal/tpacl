angular.module('TPACL', ['ngRoute'])
  .config(tconfig)
  .controller('tcontroller', tcontroller);

function tconfig($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider
    .when("/", {
      templateUrl: "main.html",
      controller: "tcontroller"
    })
    .when("/teams", {
      templateUrl: "team.html",
      controller: "tcontroller"
    });
}

function tcontroller($scope, $http) {

  $scope.player = {};
  $scope.selectedTeam = "";
  $scope.teams = [];
  $scope.nextPlayerId = null;

  $scope.currentBid = null;

  $scope.getPlayer = function (id) {
    $http.get(`/api/players/id/${id}`)
      .then(player => {
        $scope.player = player.data.success[0];
      });
  }

  $scope.getTeams = function () {
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
    if ($scope.player.status == 'Sold') return;
    else if (+$scope.selectedTeam.team_id === (index + 1)) return;
    else if ($scope.teams[index].leftBudget - bid < 0) return;
    
    // debugger;
    $scope.player.status = '';
    $scope.selectedTeam = $scope.teams[index];
    $scope.currentBid = bid;
    $scope.teams[index].budget = $scope.teams[index].leftBudget - $scope.currentBid;
  }

  $scope.nextPlayer = function () {
    $scope.getPlayer($scope.nextPlayerId);
  }

  $scope.Sold = function () {
    const playerUpdate = new Promise((resolve, reject) => {
      $http.patch(`/api/players/${$scope.player.id}`,
        {
          status: 'Sold',
          teamsId: $scope.selectedTeam.id
        }
      )
        .then(data => {
          console.log('sold', data);
          resolve();
        });
    });

    const teamUpdate = new Promise((resolve, reject) => {
      $http.patch(`/api/teams/${$scope.selectedTeam.id}`,
        {
          budget: $scope.selectedTeam.budget
        }
      )
        .then(data => {
          console.log('team sold', data);
          resolve();
        });
    });

    Promise.all([
      playerUpdate,
      teamUpdate
    ])
    .then(() => {
      $scope.selectedTeam = "";
      $scope.currentBid = null;
      $scope.getTeams();
      $scope.getPlayer($scope.nextPlayerId);    
    });
  }

  $scope.UnSold = function() {
    $http.patch(`/api/players/${$scope.player.id}`,
        {
          status: 'UnSold'
        }
      )
        .then(data => $scope.player.status = 'Unsold');
  }

}