angular.module('clinicApp').directive('homeIndex', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/home/home-index.html',
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

      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      this.start = new Date(year, month, day);
      this.end = new Date(year, month, day + 1);

      this.subscribe('appointments', () => {
        return [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
          },
          this.getReactively('searchText'),
          this.start
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

      this.helpers({
        appointments: () => {

          var found = Appointments.find({
            appointmentDate: {
              $gte: this.getReactively('start'),
              $lt: this.getReactively('end')
            }
          }, {
            sort: this.getReactively('sort')
          });
          return found;
        },
        appointmentsCount: () => {
          var count = Counts.get('numberOfAppointments');
          return count;
        }
      });

      this.removeAppointment = (appointment) => {
        Appointments.remove({
          _id: appointment._id
        });
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
  }
});
