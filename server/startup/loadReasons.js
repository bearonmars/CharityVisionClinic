Meteor.startup(function() {

  if (Reasons.find().count() === 0) {
    var reasons = [{
      'name': 'Eye Exam',
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Buy Lens',
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Consultation',
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Lasik Surgey',
      'created': new Date(),
      'createdBy': 'Admin'
    }];

    console.log("# of Reasons in the database is " + Reasons.find().count());
    if (Reasons.find().count() == 0) {
      for (var i = 0; i < reasons.length; i++) {
        Reasons.insert(reasons[i]);
        console.log("Reason '" + reasons[i].name + "' is added.");
      }
    }
  }
});
