angular.module('clinicApp').directive('patientDetails', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/patients/patient-details/patient-details.html',
    controllerAs: 'vm',
    controller: function($scope, $stateParams, $reactive) {
      $reactive(this).attach($scope);
      this.patientId = $stateParams.patientId;

      this.perPage = 10;

      this.pageForAppointments = 1;
      this.sortForAppointments = {
        appointmentDate: -1
      };

      this.pageForExams = 1;
      this.sortForExams = {
        created: -1
      };

      this.pageForTransactions = 1;
      this.sortForTransactions = {
        created: -1
      };

      this.subscribe('patients');

      this.subscribe('appointments', () => {
        return [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('pageForAppointments') - 1) * this.perPage),
            sort: this.getReactively('sortForAppointments')
          }, $stateParams.patientId
        ]
      });

      this.subscribe('exams', () => {
        return [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('pageForExams') - 1) * this.perPage),
            sort: this.getReactively('sortForExams')
          }, $stateParams.patientId
        ]
      });

      this.subscribe('transactions', () => {
        return [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('pageForTransactions') - 1) * this.perPage),
            sort: this.getReactively('sortForTransactions')
          }, $stateParams.patientId
        ]
      });

      this.helpers({
        patient: () => {
          var result = Patients.findOne({
            _id: $stateParams.patientId
          });
          return result;
        },
        appointments: () => {
          var appt = Appointments.find({
            'patient._id': $stateParams.patientId
          }, {
            sort: {
              appointmentDate: 1
            }
          });
          return appt;
        },
        appointmentsCount: () => {
          var count = Counts.get('numberOfAppointments');
          return count;
        },
        exams: () => {
          return Exams.find({
            'patient._id': $stateParams.patientId
          }, {
            sort: {
              created: 1
            }
          });
        },
        examsCount: () => {
          var count = Counts.get('numberOfExams');
          return count;
        },
        transactions: () => {
          return Transactions.find({
            'patient._id': $stateParams.patientId
          }, {
            sort: {
              created: 1
            }
          });
        },
        transactionsCount: () => {
          var count = Counts.get('numberOfTransactions');
          return count;
        }
      });

      this.appointmentPageChanged = (newPage) => {
        this.pageForAppointments = newPage;
      };

      this.examPageChanged = (newPage) => {
        this.pageForExams = newPage;
      };

      this.transactionPageChanged = (newPage) => {
        this.pageForTransactions = newPage;
      };

      this.removeAppointment = (appointment) => {
        Appointments.remove({
          _id: appointment._id
        });
      };

      this.removeExam = (exam) => {
        Exams.remove({
          _id: exam._id
        });
      };

      this.removeTransaction = (transaction) => {
        Transactions.remove({
          _id: transaction._id
        });
      };

      this.save = () => {
        Patients.update({
          _id: $stateParams.patientId
        }, {
          $set: {
            name: this.patient.name,
            cellPhone: this.patient.cellPhone,
            'public': this.patient.public
          }
        }, (error) => {
          if (error) {
            console.log('Oops, unable to update the patient...');
          } else {
            console.log('Done!');
          }
        });
      };
    }
  }
});
