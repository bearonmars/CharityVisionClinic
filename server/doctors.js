Meteor.publish("doctors", function(options, searchString) {

console.log('doctors publish:::');

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


  Counts.publish(this, 'numberOfDoctors', Doctors.find(selector), {
    noReady: true
  });
  return Doctors.find(selector, options);
});

Meteor.publish("doctorNames", function() {
  console.log('doctor names publish:::');
  return Doctors.find({}, {fields: {name: 1}});
});
