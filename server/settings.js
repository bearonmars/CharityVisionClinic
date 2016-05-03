Meteor.publish("settings", function(options, searchString) {

console.log('settings publish:::');

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

  Counts.publish(this, 'numberOfSettings', Settings.find(selector), {
    noReady: true
  });
  return Settings.find(selector, options);
});
