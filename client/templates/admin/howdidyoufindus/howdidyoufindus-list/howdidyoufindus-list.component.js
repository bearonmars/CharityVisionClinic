angular.module('clinicApp').directive('howdidyoufindusList', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/admin/howdidyoufindus/howdidyoufindus-list/howdidyoufindus-list.html',
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

      this.subscribe('howDidYouFindUsItems', () => {
        return [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
          },
          this.getReactively('searchText')
        ]
      });

      this.helpers({
        items: () => {
          var list = HowDidYouFindUsItems.find({}, {
            sort: this.getReactively('sort')
          });
          return list;
        },
        itemsCount: () => {
          var count = Counts.get('numberOfHowDidYouFindUsItems');
          return count;
        }
      });

      this.newHowDidYouFindUsItem = {};

      this.addHowDidYouFindUsItem = function() {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }
        this.newHowDidYouFindUsItem.created = new Date();
        this.newHowDidYouFindUsItem.createdBy = Meteor.userId;
        HowDidYouFindUsItems.insert(this.newHowDidYouFindUsItem, function(error, result) {
          if (error) {
            console.log('Oops, unable to create the item...');
          } else {
            console.log('the new item was added!');
          }
        });

        this.newHowDidYouFindUsItem = {};
      };

      this.removeHowDidYouFindUsItem = (item) => {
        if (window.confirm("Delete? OK or Cancel")) {
          HowDidYouFindUsItems.remove({
            _id: item._id
          });
        }
      };

      this.updateHowDidYouFindUsItem = function(item) {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }

        HowDidYouFindUsItems.update({
          _id: item._id
        }, {
          $set: {
            name: item.name
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
