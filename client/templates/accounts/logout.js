angular.module('clinicApp').directive('logout', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/accounts/logout.html',
    controllerAs: 'vm',
    controller: function($scope, $state, $stateParams) {

        Meteor.logout();
        console.log("logged out.");
        $state.go("home");

      } //end of controller
  } //end of return
}); // end of directive
