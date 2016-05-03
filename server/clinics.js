Meteor.publish("clinics", function(options, searchString) {

console.log('clinics publish:::');

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

  Counts.publish(this, 'numberOfClinics', Clinics.find(selector), {
    noReady: true
  });
  return Clinics.find(selector, options);
});
