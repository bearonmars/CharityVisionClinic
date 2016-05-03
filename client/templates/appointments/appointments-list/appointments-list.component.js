angular.module('clinicApp').directive('appointmentsList', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/appointments/appointments-list/appointments-list.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive) {
      $reactive(this).attach($scope);

      this.reverse = false;
      this.newAppointment = {};
      this.perPage = 10;
      this.page = 1;
      this.sort = {
        appointmentDate: 1
      };
      this.sortBy = 'reason';
      this.reverse = false;
      this.searchText = '';
      this.appointmentDateToSearch = Date.today();
      this.oldAppointments = false;
      this.showOldAppointments = function() {
        if (this.oldAppointments) {
          this.appointmentDateToSearch = Date.parse('January 1th, 2000');
        } else {
          this.appointmentDateToSearch = Date.today();
        }
      }

      this.helpers({
        appointments: () => {
          return Appointments.find({
            appointmentDate: {
              $gte: this.getReactively('appointmentDateToSearch')
            }
          }, {
            sort: this.getReactively('sort')
          });
        },
        appointmentsCount: () => {
          var count = Counts.get('numberOfAppointments');
          return count;
        }
      });

      this.subscribe('appointments', () => {
        return [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
          },
          this.getReactively('searchText'),
          Date.today()
        ]
      });

      this.addAppointment = () => {
        this.newAppointment.createdBy = Meteor.user()._id;
        Appointments.insert(this.newAppointment);
        this.newAppointment = {};
      };

      this.removeAppointment = (appointment) => {
        if (window.confirm("Delete? OK or Cancel")) {
          Appointments.remove({
            _id: appointment._id
          });
        }
      };

      this.pageChanged = (newPage) => {
        this.page = newPage;
      };

      this.updateSort = () => {
        this.reverse = !this.reverse;
        if (this.sortBy == "reason") {
          if (this.reverse) {
            this.sort = {
              reason: -1
            };
          } else {
            this.sort = {
              reason: 1
            };
          }
        } else if (this.sortBy == "appointmentDate") {
          if (this.reverse) {
            this.sort = {
              appointmentDate: -1
            };
          } else {
            this.sort = {
              appointmentDate: 1
            };
          }
        } else if (this.sortBy == "patient.name") {
          if (this.reverse) {
            this.sort = {
              "patient.name": -1
            };
          } else {
            this.sort = {
              "patient.name": 1
            };
          }
        }
      };
    }
  } //end of first return statment
});
