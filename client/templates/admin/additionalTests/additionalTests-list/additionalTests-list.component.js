angular.module('clinicApp').directive('additionaltestsList', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/admin/additionalTests/additionalTests-list/additionalTests-list.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive) {
      $reactive(this).attach($scope);

      this.reverse = false;
      this.perPage = 10;
      this.page = 1;
      this.sort = {
        name: 1
      };
      this.sortBy = 'name';
      this.reverse = false;
      this.searchText = '';

      this.subscribe('additionalTests', () => {
        return [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
          },
          this.getReactively('searchText')
        ]
      });

      this.helpers({
        additionalTests: () => {
          var list = AdditionalTests.find({}, {
            sort: this.getReactively('sort')
          });
          return list;
        },
        additionalTestsCount: () => {
          var count = Counts.get('numberOfAdditionalTests');
          return count;
        }
      });

      this.newAdditional = {};

      this.addAdditional = function() {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }
        this.newAdditional.created = new Date();
        this.newAdditional.createdBy = Meteor.userId;
        AdditionalTests.insert(this.newAdditional, function(error, result) {
          if (error) {
            console.log('Oops, unable to create the additional...');
          } else {
            console.log('the new additional was added!');
          }
        });

        this.newAdditional = {};
      };

      this.removeAdditional = (additional) => {
        if (window.confirm("Delete? OK or Cancel")) {
          AdditionalTests.remove({
            _id: additional._id
          });
        }
      };

      this.updateAdditional = function(additional) {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }

        AdditionalTests.update({
          _id: additional._id
        }, {
          $set: {
            name: additional.name
          }
        });
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
        }
      };
    }
  }
});
