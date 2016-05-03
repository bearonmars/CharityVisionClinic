angular.module('clinicApp').directive('appointmentEdit', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/appointments/appointment-edit/appointment-edit.html',
    controllerAs: 'vm',
    controller: function($scope, $state, $stateParams, $reactive) {
      $reactive(this).attach($scope);
      this.subscribe('reasons');
      this.subscribe('appointments');
      this.appointmentId = $stateParams.appointmentId;
      this.start = new Date(); //set reactively, so that we can monitor
      this.end = new Date(); //set reactively, so that we can monitor

      this.helpers({
        appointment2: () => { //this is hacking.  For some reason appointment is called even when the appointment date is selected.

          if (this.appointmentId) {
            var found = Appointments.findOne({
              _id: this.appointmentId
            });
            if (found) {
              if (!this.appointment) {
                this.appointment = found;

                var year = this.appointment.appointmentDate.getFullYear();
                var month = this.appointment.appointmentDate.getMonth();
                var day = this.appointment.appointmentDate.getDate();
                this.start = new Date(year, month, day);
                this.end = new Date(year, month, day);
                this.end.setDate(this.end.getDate() + 1);
              }
            }

            return found;
          }
        },
        reasons: () => {
          return Reasons.find();
        },
        appointments: () => {
          return Appointments.find({
            appointmentDate: {
              $gte: this.getReactively('start'),
              $lt: this.getReactively('end')
            },
            _id: {
              $ne: this.appointmentId
            }
          });
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

      this.updateAppointment = () => {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }

        Appointments.update({
          _id: this.appointmentId
        }, {
          $set: {
            reason: this.appointment.reason,
            appointmentDate: this.appointment.appointmentDate,
            updated: new Date(),
            updatedBy: Meteor.userId
          }
        }, function(error, result) {
          if (error) {
            console.log('Oops, unable to update the appointment...');
          } else {
            $state.go('appointments');
          }
        });
      } //end of updateAppointment
      
    } // end of controller
  } //end of return
}); //end of directive
