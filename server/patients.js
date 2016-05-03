Meteor.publish("patients", function(options, searchString) {

console.log('patients publish:::');

  if (!searchString || searchString == null) {
    searchString = '';
  }

  let selector = {
    $or: [{
      name: {
        '$regex': '.*' + searchString || '' + '.*',
        '$options': 'i'
      }
    }, {
      city: {
        '$regex': '.*' + searchString || '' + '.*',
        '$options': 'i'
      }
    }, {
      cellPhone: {
        '$regex': '.*' + searchString || '' + '.*',
        '$options': 'i'
      }
    }, {
      homePhone: {
        '$regex': '.*' + searchString || '' + '.*',
        '$options': 'i'
      }
    }]
  };

  Counts.publish(this, 'numberOfPatients', Patients.find(selector), {
    noReady: true
  });
  return Patients.find(selector, options);
});


Meteor.publish("patientNames", function() {
  console.log('patient names publish:::');
  return Patients.find({}, {fields: {name: 1}});
});
