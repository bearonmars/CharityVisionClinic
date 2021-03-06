angular.module('clinicApp').directive('reasonsList', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/admin/reasons/reasons-list/reasons-list.html',
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

      this.subscribe('reasons', () => {
        return [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
          },
          this.getReactively('searchText')
        ]
      });

      this.helpers({
        reasons: () => {
          var list = Reasons.find({}, {
            sort: this.getReactively('sort')
          });
          return list;
        },
        reasonsCount: () => {
          var count = Counts.get('numberOfReasons');
          return count;
        }
      });

      this.newReason = {};

      this.addReason = function() {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }
        this.newReason.created = new Date();
        this.newReason.createdBy = Meteor.userId;
        Reasons.insert(this.newReason, function(error, result) {
          if (error) {
            console.log('Oops, unable to create the reason...');
          } else {
            console.log('the new reason was added!');
          }
        });

        this.newReason = {};
      };

      this.removeReason = (reason) => {
        if (window.confirm("Delete? OK or Cancel")) {
          Reasons.remove({
            _id: reason._id
          });
        }
      };

      this.updateReason = function(reason) {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }

        Reasons.update({
          _id: reason._id
        }, {
          $set: {
            name: reason.name
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
