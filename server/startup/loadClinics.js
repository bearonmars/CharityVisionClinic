Meteor.startup(function() {

  if (Clinics.find().count() === 0) {
    var clinics = [{
      'name': 'Charity Vision Clinic - Sriranka',
      'created': new Date(),
      'createdBy': 'Admin'
    }];

    console.log("# of Clinics in the database is " + Clinics.find().count());
    if (Clinics.find().count() == 0) {
      for (var i = 0; i < clinics.length; i++) {
        Clinics.insert(clinics[i]);
        console.log("Clinic '" + clinics[i].name + "' is added.");
      }
    }
  }
});
