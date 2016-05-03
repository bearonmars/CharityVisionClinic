angular.module('clinicApp').directive('patientEdit', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/patients/patient-edit/patient-edit.html',
    controllerAs: 'vm',
    controller: function($scope, $state, $stateParams, $reactive) {
      $reactive(this).attach($scope);
      this.patientId = $stateParams.patientId;

      this.subscribe('patients');
      this.subscribe('howDidYouFindUsItems');

      this.helpers({
        patient: () => {
          return Patients.findOne({
            _id: this.patientId
          });
        },
        howDidYouFindUsItems: () => {
          var found = HowDidYouFindUsItems.find();
          return found;
        }
      });

      this.updatePatient = () => {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }

        if (this.patient.howDidYouFindUsItem !== undefined && this.patient.howDidYouFindUsItem._id !== "") {
          this.patient.howDidYouFindUsItem = HowDidYouFindUsItems.findOne({
            _id: this.patient.howDidYouFindUsItem._id
          });
        }

        Patients.update({
          _id: this.patientId
        }, {
          $set: {
            name: this.patient.name,
            cellPhone: this.patient.cellPhone,
            homePhone: this.patient.homePhone,
            email: this.patient.email,
            street: this.patient.street,
            city: this.patient.city,
            stateRegion: this.patient.stateRegion,
            postalCode: this.patient.postalCode,
            country: this.patient.country,
            motherSurname: this.patient.motherSurname,
            governmentId: this.patient.governmentId,
            gender: this.patient.gender,
            dob: this.patient.dob,
            howDidYouFindUsItem: this.patient.howDidYouFindUsItem,
            updated: new Date(),
            updatedBy: Meteor.userId
          }
        }, function(error, result){
          if (error) {
            console.log('Oops, unable to update the patient...');
          } else {
            $state.go('patients');
          }
        });
      };
    }
  }
});
