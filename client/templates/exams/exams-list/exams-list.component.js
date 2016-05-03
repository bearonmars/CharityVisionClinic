angular.module('clinicApp').directive('examsList', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/exams/exams-list/exams-list.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive) {
      $reactive(this).attach($scope);

      this.reverse = false;
      this.newExam = {};
      this.perPage = 10;
      this.page = 1;
      this.sort = {
        created: 1
      };
      this.sortBy = 'created';
      this.reverse = false;
      this.searchText = '';

      this.helpers({
        exams: () => {
          return Exams.find({}, {
            sort: this.getReactively('sort')
          });
        },
        examsCount: () => {
          var count = Counts.get('numberOfExams');
          return count;
        }
      });

      this.subscribe('examsList', () => {
        return [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
          },
          this.getReactively('searchText')
        ]
      });

      this.addExam = () => {
        this.newExam.createdBy = Meteor.user()._id;
        Exams.insert(this.newExam);
        this.newExam = {};
      };

      this.removeExam = (exam) => {
        if (window.confirm("Delete? OK or Cancel")) {
          Exams.remove({
            _id: exam._id
          });
        }
      };

      this.pageChanged = (newPage) => {
        this.page = newPage;
      };

      this.updateSort = () => {
        this.reverse = !this.reverse;
        if (this.sortBy == "created") {
          if (this.reverse) {
            this.sort = {
              created: -1
            };
          } else {
            this.sort = {
              created: 1
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
        } else if (this.sortBy == "doctor.name") {
          if (this.reverse) {
            this.sort = {
              "doctor.name": -1
            };
          } else {
            this.sort = {
              "doctor.name": 1
            };
          }
        }
      };
    }
  }
});
