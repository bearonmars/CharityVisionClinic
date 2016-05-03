angular.module('clinicApp').directive('examCreate', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/exams/exam-create/exam-create.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive, $state, $stateParams) {
      $reactive(this).attach($scope);
      this.subscribe('patientNames');
      this.subscribe('doctorNames');
      this.subscribe('additionalTests');

      this.patientId = $stateParams.patientId;
      this.newExam = {
        doctor: {
          _id: ""
        },
        additionalTests: []
      };

      this.helpers({
        patient: () => {
          return Patients.findOne({
            _id: $stateParams.patientId
          });
        },
        doctors: () => {
          var found = Doctors.find();
          return found;
        },
        additionalTests: () => {
          var found = AdditionalTests.find();
          this.newExam.additionalTests = found.fetch();
          return found;
        },
        isDoctor: () => {
          if (Meteor.userId()) {
            var isDoctor = Roles.userIsInRole(Meteor.userId(), 'Doctor') || Roles.userIsInRole(Meteor.userId(), 'Admin')
            if (Meteor.user()) {
              return isDoctor;
            }
          }
          return false;
        }
      });

      this.addExam = () => {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }

        if (this.newExam.doctor._id !== "") {
          this.newExam.doctor = Doctors.findOne({
            _id: this.newExam.doctor._id
          });
        }
        this.newExam.patient = this.patient;
        this.newExam.created = new Date();
        this.newExam.createdBy = Meteor.userId;

        //delete hashkey from additionalTests
        angular.forEach(this.newExam.additionalTests, function(value, key) {
          delete value.$$hashKey;
        });

        Exams.insert(this.newExam, function(error, result) {
          if (error) {
            console.log('Oops, unable to create the exam...');
          } else {
            $state.go('exams');
            this.newExam = {};
          }
        });
      }, (error) => {
        if (error) {
          console.log('Oops, unable to create the exam...');
        } else {
          console.log('Done!');
        }
      };
    }
  }
});
