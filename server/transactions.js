Meteor.publish("transactions", function(options, searchString, balance) {

  if (balance === null || balance === undefined || balance === "") {
    balance = -100000000000;
  }

  console.log('transactions publish::: balance: ' + balance);


  if (!searchString || searchString == null) {
    searchString = '';
  }

  let selector = {
    $or: [{
      reason: {
        '$regex': '.*' + searchString || '' + '.*',
        '$options': 'i'
      }
    }, {
      transactionDate: {
        '$regex': '.*' + searchString || '' + '.*',
        '$options': 'i'
      }
    }, {
      'patient.name': {
        '$regex': '.*' + searchString || '' + '.*',
        '$options': 'i'
      }
    }, {
      'patient._id': searchString
    }],
    $and: [{
      balance: {
        $gt: balance
      }
    }]
  };

  Counts.publish(this, 'numberOfTransactions', Transactions.find(selector), {
    noReady: true
  });
  // TotalBalance.publish(this, 'totalBalanceOfTransactions', Transactions.aggregate([{
  //   $group: {
  //     _id: null,
  //     total: {
  //       $sum: "$balance"
  //     }
  //   }
  // }]), {
  //   noReady: true
  // });
  var transactions = Transactions.find(selector, options);
  return transactions;
});


Meteor.publish('transactionsReport', function(start, end, doctorId) {

  var startDate = new Date(Date.parse(start));
  var endDate = new Date(Date.parse(end));
  endDate.setDate(endDate.getDate() + 1);

  console.log('transactionsReport publish:::' + startDate + " ~ " + endDate);

  var transactions = [];
  if (doctorId === null || doctorId === undefined || doctorId === "" || doctorId === -1) {
    console.log("here")
    transactions = Transactions.find({
      $or: [
        {
          "created": {
            $gte: startDate,
            $lt: endDate
          }
        },
        {
          "payments.paymentDate": {
            $gte: startDate,
            $lt: endDate
          }
        }
      ]
    });
  } else {
    transactions = Transactions.find({
      $or: [
        {
          "created": {
            $gte: startDate,
            $lt: endDate
          }
        },
        {
          "payments.paymentDate": {
            $gte: startDate,
            $lt: endDate
          }
        }
      ],
      items: {
        $elemMatch: {
          "doctor._id": doctorId
        }
      }
    });
    console.log("transactions search by doctor id + " + doctorId);
  }

  console.log("transactions count ::: >" + transactions.count());

  return transactions;
});
