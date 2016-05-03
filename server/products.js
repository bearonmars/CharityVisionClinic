Meteor.publish("products", function(options, searchString) {

console.log('products publish:::');

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

  Counts.publish(this, 'numberOfProducts', Products.find(selector), {
    noReady: true
  });
  return Products.find(selector, options);
});
