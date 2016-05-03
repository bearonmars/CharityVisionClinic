checkUserIsValid = function(aString) {
  aString = aString || '';
  return aString.length > 4;
}

checkPasswordIsValid = function(aString) {
  aString = aString || '';
  return aString.length > 7;
}

angular.module('clinicApp').directive('signup', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/accounts/signup.html',
    controllerAs: 'vm',
    controller: function($scope, $state, $stateParams) {

        this.username = "";
        this.password = "";

        this.signUp = function() {
            // if (Meteor.usernameId) {
            //   throw new Meteor.Error(500, 'already logged in.');
            // }
            //trim
            this.username = this.username.replace(/^\s*|\s*$/g, '');
            this.password = this.password.replace(/^\s*|\s*$/g, '');

            //validate
            var isValidUser = checkUserIsValid(this.username);
            var isValidPassword = checkPasswordIsValid(this.password);

            if (!isValidUser || !isValidPassword) {
              if (!isValidUser) {
                sAlert.error('Your password must be at least 5 characters long');
              }
              if (!isValidPassword) {
                sAlert.error('Your password must be at least 8 characters long');
              }
            } else {
              Accounts.createUser({
                username: this.username,
                password: this.password
              }, function(error, result) {
                if (error) {
                  console.log(error);
                  sAlert.error('Account creation failed for unknown reasons :(');
                } else {
                  $state.go('home');
                }
              });
            }
          } //end of login function


      } //end of controller
  } //end of return
}); // end of directive
