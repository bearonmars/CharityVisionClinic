angular.module('clinicApp').directive('doctorDetails', function () {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/admin/doctors/doctor-details/doctor-details.html',
    controllerAs: 'doctorDetails',
    controller: function ($scope, $stateParams, $reactive) {
      $reactive(this).attach($scope);

      this.subscribe('doctors');
      this.subscribe('users');

      this.helpers({
        doctor: () => {
          var result = Doctors.findOne({_id: $stateParams.doctorId});
          return result;
        },
        users: () => {
          return Meteor.users.find({});
        }
      });

      this.save = () => {
        Doctors.update({_id: $stateParams.doctorId}, {
          $set: {
            name: this.doctor.name,
            cellPhone: this.doctor.cellPhone,
            'public': this.doctor.public
          }
        }, (error) => {
          if (error) {
            console.log('Oops, unable to update the doctor...');
          }
          else {
            console.log('Done!');
          }
        });
      };
    }
  }
});
