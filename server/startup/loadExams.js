Meteor.startup(function() {

  if (Exams.find().count() === 0) {
    var exams = [{
      'patient': {
        '_id': '9hWMSERtJw5eXt6Eg',
        "name": "Tanya H. Shaw",
      },
      'bloodPressure': {
        'systolic': 129,
        'diastolic': 85
      },
      'bloodType': 'A',
      'diabetic': true,
      'heartDisease': true,
      'asthma': true,
      'allergiesToMedications': true,
      'allergiesMedicines': 'AMOXICILLIN',
      'unaidedAcuity': {
        'left': 20,
        'right': 30
      },
      'ioPressure': {
        'left': 12,
        'right': 22
      },
      'leftEye': {
        'near': {
          'sph': 2.0,
          'cyl': 3.0,
          'axis': 2.2,
          'pd': 5.1
        },
        'distant': {
          'sph': 2.0,
          'cyl': 3.0,
          'axis': 2.2
        },
      },
      'rightEye': {
        'near': {
          'sph': 2.0,
          'cyl': 3.0,
          'axis': 2.2,
          'pd': 5.1
        },
        'distant': {
          'sph': 2.0,
          'cyl': 3.0,
          'axis': 2.2
        },
      },
      'recommendations': '',
      'created': new Date(),
      'createdBy': 'Admin'
    }];

    console.log("# of Exams in the database is " + Exams.find().count());
    if (Exams.find().count() == 0) {
      for (var i = 0; i < exams.length; i++) {
      //for (var i = 0; i < 31; i++) {
        Exams.insert(exams[0]);
        console.log("Exam '" + exams[0].patient.name + "' is added.");
      }
    }
  }
});
