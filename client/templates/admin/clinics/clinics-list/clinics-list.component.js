angular.module('clinicApp').directive('clinicsList', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/admin/clinics/clinics-list/clinics-list.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive) {
        $reactive(this).attach($scope);

        this.sort = {
          name: 1
        };
        this.sortBy = 'name';
        this.subscribe('settings');

        this.helpers({
          clinicSetting: () => {
            var setting = Settings.findOne({
              name: "clinic"
            });

            if (typeof setting === "undefined" || setting === null) {
              setting = {
                name: 'clinic',
                value: {}
              };
            }

            return setting;
          },
        });

        this.saveClinic = function() {
          if (!Meteor.userId) {
            throw new Meteor.Error(500, 'access denied.');
          }

          if (this.clinicSetting._id) {
            Settings.update({
              _id: this.clinicSetting._id
            }, {
              $set: {
                value: this.clinicSetting.value
              }
            }, function(error, result) {
              if (error) {
                console.log("error!", error);
              } else {
                console.log("updated!");
              }
            });

          } else {
            Settings.insert(this.clinicSetting, function(error, result) {
              if (error) {
                console.log("error!", error);
              } else {
                console.log("inserted!");
              }
            });
          }
        }; //end of saveClinic

      } //end of controller
  } //end of return
}); //end of function of direcvie
