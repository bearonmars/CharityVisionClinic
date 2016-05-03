angular.module('clinicApp').directive('patientCreate', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/patients/patient-create/patient-create.html',
    controllerAs: 'vm',
    controller: function($scope, $state, $stateParams, $reactive) {
      $reactive(this).attach($scope);

      this.newPatient = {};

      this.subscribe('howDidYouFindUsItems');

      this.helpers({
        howDidYouFindUsItems: () => {
          var found = HowDidYouFindUsItems.find();
          return found;
        }
      });

      this.addPatient = function() {
        if (!Meteor.userId) {
             throw new Meteor.Error( 500, 'access denied.' );
        }
        if (this.newPatient.howDidYouFindUsItem !== undefined && this.newPatient.howDidYouFindUsItem._id !== "") {
          this.newPatient.howDidYouFindUsItem = HowDidYouFindUsItems.findOne({
            _id: this.newPatient.howDidYouFindUsItem._id
          });
        }
        this.newPatient.created = new Date();
        this.newPatient.createdBy = Meteor.userId;
        Patients.insert(this.newPatient, function(error, result){
          if (error) {
            console.log('Oops, unable to add the new patient...');
            console.log(error);
          } else {
            $state.go('patientDetails', { patientId: result});
          }
        });
      };
    }
  }
});
