Meteor.startup(function() {

  if (UserRoles.find().count() === 0) {
    var userUserRoles = [{
      'name': 'Admin',
      'created': new Date(),
      'createdBy': 'Admin'
    },{
      'name': 'Doctor',
      'created': new Date(),
      'createdBy': 'Admin'
    },{
      'name': 'Finance',
      'created': new Date(),
      'createdBy': 'Admin'
    },{
      'name': 'RegularUser',
      'created': new Date(),
      'createdBy': 'Admin'
    }];

    console.log("# of UserRoles in the database is " + UserRoles.find().count());
    if (UserRoles.find().count() == 0) {
      for (var i = 0; i < userUserRoles.length; i++) {
        UserRoles.insert(userUserRoles[i]);
        console.log("UserRole '" + userUserRoles[i].name + "' is added.");
      }
    }
  }
});
