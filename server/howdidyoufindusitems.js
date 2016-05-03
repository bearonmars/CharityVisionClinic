Meteor.publish("howDidYouFindUsItems", function(options, searchString) {

console.log('howDidYouFindUsItems publish:::');

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

  Counts.publish(this, 'numberOfHowDidYouFindUsItems', HowDidYouFindUsItems.find(selector), {
    noReady: true
  });
  var items = HowDidYouFindUsItems.find(selector, options);
  return items;
});
