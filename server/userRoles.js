Meteor.publish('userRoles', function(options, searchString) {
    console.log('userRoles publish:::');

    if (!searchString || searchString == null) {
      searchString = '';
    }

    let selector = {
      $or: [{
        name: {
          '$regex': '.*' + searchString || '' + '.*',
          '$options': 'i'
        }
      }]
    };
  return UserRoles.find(selector, options);
});
