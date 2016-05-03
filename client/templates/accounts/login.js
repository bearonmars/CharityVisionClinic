angular.module('clinicApp').directive('login', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/accounts/login.html',
    controllerAs: 'vm',
    controller: function($scope, $state, $stateParams, $reactive) {
        $reactive(this).attach($scope);

        Session.set("errorMessage", "");

        this.username = "";
        this.password = "";

        if (Meteor.user()) {
          Session.set("userLoggedIn", false);
          Meteor.logout();
          $state.go("home");
        }

        this.helpers({
          errorMessage: () => {
            return Session.get("errorMessage");
          },
          userLoggedIn: () => {
            return Session.get("userLoggedIn");
          }
        });

        this.login = function() {
            Session.set("errorMessage", "");
            //trim
            this.username = this.username.replace(/^\s*|\s*$/g, '');
            this.password = this.password.replace(/^\s*|\s*$/g, '');

            //validate
            if (this.username.length < 4) {
              this.errorMessage = 'UserName must be at least 4 characters long';
              return;
            }
            if (this.password.length < 8) {
              this.errorMessage = 'Password must be at least 8 characters long';
              return;
            }

            Meteor.loginWithPassword(this.username, this.password, function(error) {
              if (error) {
                console.log('error', error.message);
                Session.set("errorMessage", error.message);
                Session.set("userLoggedIn", false);
              } else {
                console.log('logged in successfully.')
                // Session.set("userLoggedIn", true);
                $state.go('home');
                // setTimeout(function(){ $state.go('home'); }, 200);
              }
            });

          } //end of login function
      } //end of controller
  } //end of return
}); // end of directive
