angular.module('clinicApp').directive('doctorCreate', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/admin/doctors/doctor-create/doctor-create.html',
    controllerAs: 'doctorCreate',
    controller: function($scope, $state, $stateParams) {
      this.newDoctor = {};

      this.addDoctor = () => {
        if (!Meteor.userId) {
             throw new Meteor.Error( 500, 'access denied.' );
        }
        this.newDoctor.created = new Date();
        this.newDoctor.createdBy = Meteor.userId;
        Doctors.insert(this.newDoctor, function(error, result){
          if (error) {
            console.log('Oops, unable to create the doctor...');
          } else {
            $state.go('doctors');
            this.newDoctor = {};
          }
        });
      }, (error) => {
        if (error) {
          console.log('Oops, unable to create the doctor...');
        } else {
          console.log('Done!');
        }
      };
    }
  }
});
