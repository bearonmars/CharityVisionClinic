Meteor.startup(function() {

  if (Transactions.find().count() === 0) {
    var dateTime = new Date();
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth() + 1;
    var day = dateTime.getDate();
    var today = new Date(Date.parse(month + "/" + day + "/" + year));
    console.log("today = ", today);
    var transactions = [{
      'patient': {
        '_id': '9hWMSERtJw5eXt6Eg',
        "name": "Tanya H. Shaw",
      },
      'items': [{
        'name': 'Eye Exam',
        'price': 55
      }, {
        'name': 'Contact Lens',
        'price': 145
      }],
      'subtotal': 200,
      'discountPercentage': 10,
      'discount': 20,
      'total': 180,
      'payments': [{
        'paymentAmount': 100,
        'paymentDate': new Date()
      }, {
        'paymentAmount': 40,
        'paymentDate': new Date()
      }],
      'paymentTotal': 140,
      'balance': 60,
      'created': new Date(),
      'createdDate': today,
      'createdBy': 'Admin'
    }];

    console.log("# of Transactions in the database is " + Transactions.find().count());
    if (Transactions.find().count() == 0) {

      for (var i = 0; i < transactions.length; i++) {

        Transactions.insert(transactions[i]);
        console.log("Transaction '" + transactions[0].patient.name + "' is added.");
      }

      // var date = new Date(2016, 02, 11);
      //
      // var it = 0;
      // for (var i = 0; i < 25; i++) {
      //
      //   if ((i % 4) === 0) {
      //     it++;
      //     date = new Date(2016, 02, 11 + it);
      //   }
      //   transactions[0].created = date;
      //   Transactions.insert(transactions[0]);
      //   console.log("Transaction '" + transactions[0].patient.name + "' is added.");
      // }
    }
  }
});
