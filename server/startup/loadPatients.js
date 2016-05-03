Meteor.startup(function() {
  if (Patients.find().count() === 0) {
    var patients = [{
      _id: 'WsS5BqTdRF9yMfb9y',
      'name': 'Alexander D. Cain',
      'cellPhone': '979-775-6088',
      'homePhone': '979-775-6089',
      'email': 'LindaJMcKeon@armyspy.com',
      'street': '3532 Colonial Drive',
      'city': 'Bryan',
      'stateRegion': 'TX',
      'postalCode': '77803',
      'country': 'USA',
      'motherSurname': 'lee',
      'governmentId': '123456879',
      'gender': 'M',
      'dob': new Date(1980, 5, 1),
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      '_id': 'NmRYufkxeoHuZ437z',
      'name': 'Latosha E. Hartwell',
      'cellPhone': '502-873-4610',
      'homePhone': '502-873-4611',
      'email': 'LatoshaEHartwell@rhyta.com',
      'street': '1707 Karen Lane',
      'city': 'Louisville',
      'stateRegion': 'KY',
      'postalCode': '40220',
      'country': 'USA',
      'motherSurname': 'lee',
      'governmentId': '123456879',
      'gender': 'M',
      'dob': new Date(1980, 5, 1),
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      '_id': '9hWMSERtJw5eXt6Eg',
      'name': 'Tanya H. Shaw',
      'cellPhone': '562-301-0464',
      'homePhone': '562-301-0465',
      'email': 'TanyaHShaw@rhyta.com',
      'street': '3974 Reynolds Alley',
      'city': 'Burbank',
      'stateRegion': 'CA',
      'postalCode': '91505',
      'country': 'USA',
      'motherSurname': 'lee',
      'governmentId': '123456879',
      'gender': 'M',
      'dob': new Date(1980, 5, 1),
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Jason T. Diggs',
      'cellPhone': '276-973-0995',
      'homePhone': '276-973-0996',
      'email': 'JasonTDiggs@jourrapide.com',
      'street': '2711 Payne Street',
      'city': 'Norton',
      'stateRegion': 'VA',
      'postalCode': '24273',
      'country': 'USA',
      'motherSurname': 'lee',
      'governmentId': '123456879',
      'gender': 'M',
      'dob': new Date(1980, 5, 1),
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Mary M. Baker',
      'cellPhone': '203-413-6627',
      'homePhone': '203-413-6628',
      'email': 'MaryMBaker@dayrep.com',
      'street': '1655 Cheshire Road',
      'city': 'New York',
      'stateRegion': 'CT',
      'postalCode': '10011',
      'country': 'USA',
      'motherSurname': 'lee',
      'governmentId': '123456879',
      'gender': 'M',
      'dob': new Date(1980, 5, 1),
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Jordan A. Bear',
      'cellPhone': '828-608-1798',
      'homePhone': '828-608-1799',
      'email': 'JordanABear@rhyta.com',
      'street': '2396 Goosetown Drive',
      'city': 'Charlotte',
      'stateRegion': 'NC',
      'postalCode': '28202',
      'country': 'USA',
      'motherSurname': 'lee',
      'governmentId': '123456879',
      'gender': 'M',
      'dob': new Date(1980, 5, 1),
      'created': new Date(),
      'createdBy': 'Admin'
    }, {
      'name': 'Charles W. Barber',
      'cellPhone': '612-480-0931',
      'homePhone': '612-480-0932',
      'email': 'MaryMBaker@dayrep.com',
      'street': '3134 Sardis Station',
      'city': 'Golden Valley',
      'stateRegion': 'MN',
      'postalCode': '55427',
      'country': 'USA',
      'motherSurname': 'lee',
      'governmentId': '123456879',
      'gender': 'M',
      'dob': new Date(1980, 5, 1),
      'created': new Date(),
      'createdBy': 'Admin'
    }];

    console.log("# of Patients in the database is " + Patients.find().count());
    if (Patients.find().count() == 0) {
      for (var i = 0; i < patients.length; i++) {
        patients[i].created.setDate(patients[i].created.getDate() -(patients.length-i));
        Patients.insert(patients[i]);
        console.log("Patient '" + patients[i].name + "' is added.");
      }

      // for (var j = 0; j < 100; j++) {
      //   for (var i = 0; i < patients.length; i++) {
      //     patients[i].name = Random.id(10);
      //     Patients.insert(patients[i]);
      //     console.log("Patient '" + patients[i].name + "' is added.");
      //   }
      // }
    }
  }
});
