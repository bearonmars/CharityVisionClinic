angular.module('clinicApp').directive('doctorsList', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/admin/doctors/doctors-list/doctors-list.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive) {
      $reactive(this).attach($scope);

      this.reverse = false;
      this.newDoctor = {};
      this.perPage = 10;
      this.page = 1;
      this.sort = {
        createdBy: 1
      };
      this.sortBy = 'name';
      this.reverse = false;
      this.searchText = '';

      this.helpers({
        doctors: () => {
          return Doctors.find({}, {
            sort: this.getReactively('sort')
          });
        },
        doctorsCount: () => {
          var count = Counts.get('numberOfDoctors');
          return count;
        }
      });

      this.subscribe('doctors', () => {
        return [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
          },
          this.getReactively('searchText')
        ]
      });

      this.addDoctor = () => {
        this.newDoctor.createdBy = Meteor.user()._id;
        Doctors.insert(this.newDoctor);
        this.newDoctor = {};
      };

      this.removeDoctor = (doctor) => {
        if (window.confirm("Delete? OK or Cancel")) {
          Doctors.remove({
            _id: doctor._id
          });
        }
      };

      this.pageChanged = (newPage) => {
        this.page = newPage;
      };

      this.updateSort = () => {
        this.reverse = !this.reverse;
        if (this.sortBy == "name"){
          if (this.reverse) { this.sort = { name: -1}; } else {this.sort = { name: 1 };}
        } else if (this.sortBy == "city"){
          if (this.reverse) { this.sort = { city: -1}; } else {this.sort = { city: 1 };}
        }
      };
    }
  }
});
