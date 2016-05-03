function getDateOnly(dateTime, hour) {
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth();
  var day = dateTime.getDate();
  return new Date(year, month, day, hour, 0);
};

angular.module('clinicApp').directive('appointmentCreate', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/appointments/appointment-create/appointment-create.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive, $state, $stateParams) {
      $reactive(this).attach($scope);
      this.patientId = $stateParams.patientId;

      this.perPage = 10;
      this.page = 1;
      this.sort = {
        appointmentDate: 1
      };
      this.searchText = '';

      this.subscribe('patientNames');
      this.subscribe('reasons');
      this.subscribe('appointments', () => {
        return [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
          },
          this.getReactively('searchText'),
          Date.today()
        ]
      }, {
        onReady: function() {
          // console.log("onReady And the appointments actually Arrive", arguments);
          //subscriptionHandle.stop(); // Stopping the subscription, will cause onStop to fire
        },
        onStop: function(error) {
          if (error) {
            console.log('An error happened - ', error);
          } else {
            console.log('The subscription stopped');
          }
        }
      });

      this.start = getDateOnly(new Date(), 0);
      this.end = getDateOnly(new Date(), 0);
      this.end.setDate(this.end.getDate() + 1);

      this.newAppointment = {
        appointmentDate: getDateOnly(new Date(), 9)
      };


      this.helpers({
        patient: () => {
          return Patients.findOne({
            _id: $stateParams.patientId
          });
        },
        reasons: () => {
          return Reasons.find();
        },
        appointments: () => {
          var found = Appointments.find({
            appointmentDate: {
              $gte: this.getReactively('start'),
              $lt: this.getReactively('end')
            }
          });
          return found;
        }
      });

      this.selectAppointmentDate = (dateTime) => {
        if (dateTime) {
          var year = dateTime.getFullYear();
          var month = dateTime.getMonth();
          var day = dateTime.getDate();
          this.start = new Date(year, month, day);
          this.end = new Date(year, month, day);
          this.end.setDate(this.end.getDate() + 1);
        }
      };

      this.addAppointment = () => {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }
        this.newAppointment.patient = this.patient;
        this.newAppointment.created = new Date();
        this.newAppointment.createdBy = Meteor.userId;
        Appointments.insert(this.newAppointment, function(error, result) {
          if (error) {
            console.log('Oops, unable to create the appointment...');
          } else {
            $state.go('appointments');
            this.newAppointment = {};
          }
        });
      }, (error) => {
        if (error) {
          console.log('Oops, unable to create the appointment...');
        } else {
          console.log('Done!');
        }
      };
    }
  }
});
