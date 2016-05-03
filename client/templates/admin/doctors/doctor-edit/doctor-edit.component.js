angular.module('clinicApp').directive('doctorEdit', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/admin/doctors/doctor-edit/doctor-edit.html',
    controllerAs: 'vm',
    controller: function($scope, $state, $stateParams, $reactive) {
      $reactive(this).attach($scope);
      this.doctorId = $stateParams.doctorId;
      this.subscribe('doctors');

      this.helpers({
        doctor: () => {
          return Doctors.findOne({
            _id: this.doctorId
          });
        }
      }, (error) => {
        if (error) {
          console.log('Oops, unable to update the doctor...');
        } else {
          console.log('Done!');
        }
      });

      this.updateDoctor = () => {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }

        Doctors.update({
          _id: this.doctorId
        }, {
          $set: {
            name: this.doctor.name,
            cellPhone: this.doctor.cellPhone,
            homePhone: this.doctor.homePhone,
            email: this.doctor.email,
            street: this.doctor.street,
            city: this.doctor.city,
            stateRegion: this.doctor.stateRegion,
            postalCode: this.doctor.postalCode,
            country: this.doctor.country,
            updated: new Date(),
            updatedBy: Meteor.userId
          }
        }, function(error, result){
          if (error) {
            console.log('Oops, unable to update the doctor...');
          } else {
            $state.go('doctors');
          }
        });
      };
    }
  }
});
