angular.module('clinicApp').directive('update', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/accounts/update.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive, $state, $stateParams) {
        $reactive(this).attach($scope);

        Session.set("errorMessage", "");
        Session.set("message", "");
        this.oldPassword = "";
        this.newPassword = "";

        this.helpers({
          errorMessage: () => {
            return Session.get("errorMessage");
          },
          message: () => {
            return Session.get("message");
          }
        });

        this.update = function() {
            Session.set("errorMessage", "");
            Session.set("message", "");
            this.oldPassword = this.oldPassword.replace(/^\s*|\s*$/g, '');
            if (this.oldPassword.length < 8) {
              this.errorMessage = 'Old Password must be at least 8 characters long';
              return;
            }

            this.newPassword = this.newPassword.replace(/^\s*|\s*$/g, '');
            if (this.newPassword.length < 8) {
              this.errorMessage = 'New Password must be at least 8 characters long';
              return;
            }

            Meteor.call('changePassword', this.oldPassword, this.newPassword, function(error, result) {
              if (error) {
                console.log("error", error);
                Session.set("errorMessage", error.message);
              } else {
                Session.set("message", 'password changed  successfully.');
              }
            }); //end of Meteor.call('updateUser')

            console.log("end");

          } //end of update function
      } //end of controller
  } //end of return
}); // end of directive
