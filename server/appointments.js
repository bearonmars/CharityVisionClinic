Meteor.publish("appointments", function(options, searchString, today) {

  console.log('appointments publish:::');
  console.log("today: " + today);


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
      'patient.name': {
        '$regex': '.*' + searchString || '' + '.*',
        '$options': 'i'
      }
    }, {
      'patient._id': searchString
    }],
    $and: [{
      appointmentDate: {
        $gte: today
      }
    }]
  };

  Counts.publish(this, 'numberOfAppointments', Appointments.find(selector), {
    noReady: true
  });

  var result = Appointments.find(selector, options);
  return result;
}, {
  noReady: true
});
