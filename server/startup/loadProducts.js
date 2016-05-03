Meteor.startup(function() {

  if (Products.find().count() === 0) {
    var products = [{
      'name': 'Eye Exam',
      'price': 50.00,
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Contact Lens',
      'price': 100,
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Lens Soultion',
      'price': 10,
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Coach Glasses Frame',
      'price': 350,
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Generic Glasses Frame',
      'price': 30,
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Lens Wiper',
      'price': 5,
      'created': new Date(),
      'createdBy': 'Admin'
    }];

    console.log("# of Products in the database is " + Products.find().count());
    if (Products.find().count() == 0) {
      for (var i = 0; i < products.length; i++) {
        Products.insert(products[i]);
        console.log("Product '" + products[i].name + "' is added.");
      }
    }
  }
});
