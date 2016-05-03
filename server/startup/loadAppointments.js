Meteor.startup(function() {

  if (Appointments.find().count() === 0) {

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();

    var appointments = [{
      'patient': {
        _id: 'WsS5BqTdRF9yMfb9y',
        name: 'Alexander D. Cain'
      },
      'reason': 'Eye Exam',
      'appointmentDate': new Date(year, month, day, 10, 00),
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'patient': {
        '_id': 'NmRYufkxeoHuZ437z',
        'name': 'Latosha E. Hartwell'
      },
      'reason': 'Consulation',
      'appointmentDate': new Date(year, month, day, 10, 30),
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'patient': {
        '_id': '9hWMSERtJw5eXt6Eg',
        'name': 'Tanya H. Shaw'
      },
      'reason': 'Lasik Surgery',
      'appointmentDate': new Date(year, month, day, 11, 00),
      'created': new Date(),
      'createdBy': 'Admin'
    }];

    console.log("# of Appointments in the database is " + Appointments.find().count());
    if (Appointments.find().count() == 0) {
      for (var i = 0; i < appointments.length; i++) {
        Appointments.insert(appointments[i]);
        console.log("Appointment '" + appointments[i].reason + "' is added.");
      }
    }
  }
});
