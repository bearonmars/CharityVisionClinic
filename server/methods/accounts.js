Meteor.methods({
  associateUserRole: function(targetUserId, username, roles) {
    var creatorId = Meteor.userId();
    if (username !== "yseo" && username !== "djackson" && (!Roles.userIsInRole(creatorId, ['Admin']))) { //You'll have to customize this to how you want it
      console.log('not-authorized');
      throw new Meteor.Error('not-authorized');
    }
    Roles.addUsersToRoles(targetUserId, roles);
  },
  addUser: function(name, username, password) {
    var creatorId = Meteor.userId();
    if (username !== "yseo" && username !== "djackson" && (!Roles.userIsInRole(creatorId, ['Admin']))) { //You'll have to customize this to how you want it
      console.log('not-authorized');
      throw new Meteor.Error('not-authorized');
    }

    return Accounts.createUser({
      username: username,
      password: password,
      profile: {
        name: name
      }
    });
  },
  makeMeAdmin: function() {
    Meteor.users.update({
      _id: this.username
    }, {
      $set: {
        admin: true
      }
    });
  },
  updateUser: function(targetUserId, name, role) {
    var loggedInUser = Meteor.user()
    if (!loggedInUser ||
      !Roles.userIsInRole(loggedInUser, ['Admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    Meteor.users.update({
      _id: targetUserId
    }, {
      $set: {
        "profile.name": name
      }
    });
    console.log("user name has been set successully.", name);
    var roles = [];
    roles.push(role);
    Roles.setUserRoles(targetUserId, roles)
    console.log("role has been set successully.", roles);
  },
  updateUserRoles: function(targetUserId, roles, group) {
    var loggedInUser = Meteor.user()
    if (!loggedInUser ||
      !Roles.userIsInRole(loggedInUser, ['Admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    Roles.setUserRoles(targetUserId, roles)
  },
  removeUser: function(targetUserId) {
    var loggedInUser = Meteor.user()
    if (!loggedInUser ||
      !Roles.userIsInRole(loggedInUser, ['Admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }

    var username = Meteor.users.findOne({
      _id: targetUserId
    }).username;
    if (username.toUpperCase() === "DJACKSON") {
      throw new Meteor.Error(403, "can't delete the selected user")
      return;
    }
    Meteor.users.remove({
      _id: targetUserId
    });
    console.log("user has been removed.");
  }
});
