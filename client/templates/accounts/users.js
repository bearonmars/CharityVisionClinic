angular.module('clinicApp').directive('users', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/accounts/users.html',
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
      this.selectedUserRole = '';

      this.subscribe('userRoles');
      this.subscribe('users', () => {
        return [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
          },
          this.getReactively('searchText')
        ]
      });

      this.helpers({
        users: () => {
          var list = [];
          Meteor.users.find({}, {
            sort: this.getReactively('sort')
          }).forEach(function(user) {
            list.push({
              _id: user._id,
              username: user.username,
              name: user.profile.name,
              role: user.roles[0]
            });
          });
          return list;
        },
        usersCount: () => {
          var count = Meteor.users.find().count();
          return count;
        },
        userRoles: () => {
          var list = UserRoles.find({}, {
            sort: this.getReactively('sort')
          });
          return list;
        }
      });

      this.check = (targetUser) => {
        return targetUser.username.toUpperCase() === "DJACKSON";
      }

      this.checkUser = (targetUserId) => {
        if (Meteor.users !== null && Meteor.users !== undefined) {
          var user = Meteor.users.findOne({
            _id: targetUserId
          });
          return user.username.toUpperCase() === "DJACKSON" || targetUserId === Meteor.user()._id;;
        }
        return false;
      };

      this.removeUser = (user) => {
        if (user.username.toUpperCase() === "DJACKSON") {
          this.errorMessage = "can't delete the selected user";
          return;
        }
        if (window.confirm("Delete? OK or Cancel")) {
          Meteor.call('removeUser', user._id, function(error, result) {
            if (error) {
              Session.set("errorMessage", 'failed to remove user : ' + error.message);
            } else {
              Session.set("message", 'user was removed successfully');
            }
          });
        }
      };

      this.updateUser = function(user) {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }
        Meteor.call('updateUser', user._id, user.name, user.role, function(error, result) {
          if (error) {
            Session.set("errorMessage", 'failed to update user name : ' + error.message);
          } else {
            Session.set("message", 'user name was updated successfully');
          }
        });
      }

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
        } else if (this.sortBy == "price") {
          if (this.reverse) {
            this.sort = {
              price: -1
            };
          } else {
            this.sort = {
              price: 1
            };
          }
        }
      };
    }
  }
});
