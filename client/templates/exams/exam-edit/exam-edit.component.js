angular.module('clinicApp').directive('examEdit', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/exams/exam-edit/exam-edit.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive, $state, $stateParams, $window, $meteor) {
        $reactive(this).attach($scope);

        this.subscribe('exams');
        this.subscribe('patients');
        this.subscribe('doctorNames');
        this.subscribe('additionalTests');
        this.examId = $stateParams.examId;
        this.selectedItemId = "";
        this.modified = false;

        this.helpers({
          exam: () => {
            var found = Exams.findOne({
              _id: $stateParams.examId
            });

            if (found !== null && found !== undefined) {
              var additionalTests = AdditionalTests.find();
              angular.forEach(additionalTests, function(value, key) {
                var additionalTest = found.additionalTests === undefined || found.additionalTests === null ? null : GetAdditionalTests(found.additionalTests, value._id);
                if (additionalTest === null || additionalTest === undefined) {
                  if (found.additionalTests === undefined || found.additionalTests === null) {
                    found.additionalTests = [];
                  }
                  found.additionalTests.push(value);
                }
              });
            }
            return found;
          },
          doctors: () => {
            var found = Doctors.find();
            if (found.count() > 0) {
              console.log("doctors ready")
            } else {
              console.log("doctors not ready yet.")
            }
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

        function GetAdditionalTests(additionalTests, id) {
          for (i = 0; i < additionalTests.length; i++) {
            if (additionalTests[i]._id === id) {
              return additionalTests[i];
            }
          }

          return null;
        }

        this.updateExam = function() {

          if (!Meteor.userId) {
            throw new Meteor.Error(500, 'access denied.');
          }

          if (this.exam.doctor && this.exam.doctor._id !== "") {
            this.exam.doctor = Doctors.findOne({
              _id: this.exam.doctor._id
            });
          }

          //delete hashkey from additionalTests
          angular.forEach(this.exam.additionalTests, function(value, key) {
            delete value.$$hashKey;
          });

          Exams.update({
            _id: this.examId
          }, {
            $set: {
              doctor: this.exam.doctor,
              patientConcerns: this.exam.patientConcerns,
              bloodPressure: this.exam.bloodPressure,
              bloodType: this.exam.bloodType,
              bloodTypePositiveNegative: this.exam.bloodTypePositiveNegative,
              PreviousEyeProcedures: this.exam.PreviousEyeProcedures,

              diabetic: this.exam.diabetic,
              heartDisease: this.exam.heartDisease,
              asthma: this.exam.asthma,
              other: this.exam.other,
              otherText: this.exam.otherText,

              familyDiabetic: this.exam.familyDiabetic,
              familyHeartDisease: this.exam.familyHeartDisease,
              familyAsthma: this.exam.familyAsthma,
              familyOther: this.exam.familyOther,
              familyOtherText: this.exam.familyOtherText,

              currentMedications: this.exam.currentMedications,
              allergiesToMedications: this.exam.allergiesToMedications,
              allergiesMedicines: this.exam.allergiesMedicines,
              unaidedAcuity: this.exam.unaidedAcuity,
              ioPressure: this.exam.ioPressure,
              leftEye: this.exam.leftEye,
              rightEye: this.exam.rightEye,
              recommendations: this.exam.recommendations,
              additionalTests: this.exam.additionalTests,
              update: new Date(),
              updateBy: Meteor.userId
            }
          }, function(error, result) {
            if (error) {
              console.log("Oops, unable to update the exam...");
              console.log(error.reason);
            } else {
              $window.location.href = '/exams';
            }
          });

          this.modified = false;
        }; //end of this.updateExam

      } //end of controller
  } //end of return statement of angular module
}); // end of directive
