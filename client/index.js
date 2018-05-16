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

  $scope.getPlayer = function(id) {
    $http.get(`/api/players/id/${id}`)
    .then(player => {
      $scope.player = player.data.success[0];
    });
  }

  $scope.getPlayer("1");

}