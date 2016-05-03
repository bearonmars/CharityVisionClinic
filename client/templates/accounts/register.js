angular.module('clinicApp').directive('register', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/accounts/register.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive, $state, $stateParams) {
        $reactive(this).attach($scope);

        Session.set("errorMessage", "");
        Session.set("message", "");
        this.name = "";
        this.username = "";
        this.password = "";
        this.userRole = "RegularUser";

        this.subscribe('userRoles');
        this.helpers({
          userRoles: () => {
            var result = UserRoles.find({}, {
              sort: {
                name: 1
              }
            })
            return result;
          },
          errorMessage: () => {
            return Session.get("errorMessage");
          },
          message: () => {
            return Session.get("message");
          }
        });

        this.reset = function() {
          this.name = "";
          this.username = "";
          this.password = "";
          this.userRole = "";
        }

        this.register = function() {
            Session.set("errorMessage", "");
            Session.set("message", "");
            this.name = this.name.replace(/^\s*|\s*$/g, '');
            this.username = this.username.replace(/^\s*|\s*$/g, '');
            this.password = this.password.replace(/^\s*|\s*$/g, '');

            //validate
            if (this.name.length < 5) {
              this.errorMessage = 'Name must be at least 5 characters long';
              return;
            }

            if (this.username.length < 4) {
              this.errorMessage = 'UserName must be at least 4 characters long';
              return;
            }
            if (this.password.length < 8) {
              this.errorMessage = 'Password must be at least 8 characters long';
              return;
            }
            if (this.userRole === undefined || this.userRole === null || this.userRole === "") {
              this.errorMessage = "User Role must be selected";
              return;
            }

            var roles = [];
            roles.push(this.userRole);
            Session.set("roles", roles);
            Session.set("addedUserName", this.username);
            Meteor.call('addUser', this.name, this.username, this.password, function(error, result) {
              if (error) {
                Session.set("errorMessage", error.message);
              } else {
                Session.set("message", 'registered successfully.');
                var createdUserId = result;

                var rolesFromSession = Session.get("roles");
                var addedUserName = Session.get("addedUserName");
                Meteor.call('associateUserRole', createdUserId, addedUserName, rolesFromSession, function(error, result) {
                  if (error) {
                    Session.set("errorMessage", 'failed to associate user role : ' + error.message);
                  } else {
                    Session.set("message", 'user role was associated successfully');
                  }
                }); //end of Meteor.call('associateUserRole')
                Session.set("roles", "");
              }
            }); //end of Meteor.call('createUser')
          } //end of register function
      } //end of controller
  } //end of return
}); // end of directive
