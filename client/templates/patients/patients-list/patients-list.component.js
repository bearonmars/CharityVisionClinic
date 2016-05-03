angular.module('clinicApp').directive('patientsList', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/patients/patients-list/patients-list.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive) {
      $reactive(this).attach($scope);

      this.reverse = false;
      this.newPatient = {};
      this.perPage = 10;
      this.page = 1;
      this.sort = {
        created: -1
      };
      this.sortBy = 'name';
      this.reverse = false;
      this.searchText = '';

      this.helpers({
        patients: () => {
          return Patients.find({}, {
            sort: this.getReactively('sort')
          });
        },
        patientsCount: () => {
          return Counts.get('numberOfPatients');
        }
      });

      this.subscribe('patients', () => {
        return [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
          },
          this.getReactively('searchText')
        ]
      });

      this.addPatient = () => {
        this.newPatient.createdBy = Meteor.user()._id;
        Patients.insert(this.newPatient);
        this.newPatient = {};
      };

      this.removePatient = (patient) => {
        if (window.confirm("Delete? OK or Cancel")) {
          Patients.remove({
            _id: patient._id
          });
        }
      };

      this.pageChanged = (newPage) => {
        this.page = newPage;
      };

      this.updateSort = () => {
        this.reverse = !this.reverse;
        if (this.sortBy == "name") {
          if (this.reverse) {
            this.sort = {
              name: -1
            };
          } else {
            this.sort = {
              name: 1
            };
          }
        } else if (this.sortBy == "city") {
          if (this.reverse) {
            this.sort = {
              city: -1
            };
          } else {
            this.sort = {
              city: 1
            };
          }
        }
      };
    }
  }
});
