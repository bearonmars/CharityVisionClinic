Meteor.startup(function() {

  if (Settings.find().count() === 0) {
    var settings = [{
      'name': 'Charity Vision Setting - Sriranka',
      'created': new Date(),
      'createdBy': 'Admin'
    }];

    console.log("# of Settings in the database is " + Settings.find().count());
    if (Settings.find().count() == 0) {
      Settings.insert({
        name: "clinic", value: {
          name: "Charity Vision Clinic",
          phone: "801-555-1234",
          fax: "801-555-1235",
          email: "dougjackson@test.com",
          address: "7201 S Union Park Center, Suite 250, Sandy, UT 84046 USA"
        }
      });
      console.log("Clinic '" + settings[0].value + "' is added.");
    }
  }
});
