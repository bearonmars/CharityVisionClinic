Meteor.startup(function() {

  if (AdditionalTests.find().count() === 0) {
    var additionalTests = [{
      'name': 'Cataract Test',
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Glaucoma Test',
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Lasik Test',
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Conjunctivitis Test',
      'created': new Date(),
      'createdBy': 'Admin'
    }];

    console.log("# of AdditionalTests in the database is " + AdditionalTests.find().count());
    if (AdditionalTests.find().count() == 0) {
      for (var i = 0; i < additionalTests.length; i++) {
        AdditionalTests.insert(additionalTests[i]);
        console.log("AdditionalTest '" + additionalTests[i].name + "' is added.");
      }
    }
  }
});
