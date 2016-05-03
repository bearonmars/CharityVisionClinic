Meteor.publish("examsList", function(options, searchString) {

  console.log('examsList publish:::');

  if (!searchString || searchString == null) {
    searchString = '';
  }

  let selector = {
    $or: [{
      recommendations: {
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
    }]
  };

  Counts.publish(this, 'numberOfExams', Exams.find(selector), {
    noReady: true
  });

  if (searchString === '') {
    return Exams.find({_id: "1234"});
  }
  return Exams.find(selector, options);
});


Meteor.publish("exams", function(options, searchString) {

  console.log('exams publish:::');

  if (!searchString || searchString == null) {
    searchString = '';
  }

  let selector = {
    $or: [{
      recommendations: {
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
    }]
  };

  Counts.publish(this, 'numberOfExams', Exams.find(selector), {
    noReady: true
  });

  return Exams.find(selector, options);
});
