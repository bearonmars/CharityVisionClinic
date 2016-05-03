Meteor.startup(function() {

  if (HowDidYouFindUsItems.find().count() === 0) {
    var items = [{
      'name': 'Google Search',
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Employee Referral',
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Friend Referral',
      'created': new Date(),
      'createdBy': 'Admin'
    }];

    console.log("# of HowDidYouFindUsItems in the database is " + HowDidYouFindUsItems.find().count());
    if (HowDidYouFindUsItems.find().count() == 0) {
      for (var i = 0; i < items.length; i++) {
        HowDidYouFindUsItems.insert(items[i]);
        console.log("HowDidYouFindUsItem '" + items[i].name + "' is added.");
      }
    }
  }
});
