// Meteor.publish("users", function () {
//   return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
// });


Meteor.publish( 'users', function() {
  let isAdmin = Roles.userIsInRole( this.userId, 'Admin' );

  if ( isAdmin ) {
    return [
      Meteor.users.find( {}, { fields: { "profile":1, "username": 1, "roles": 1 } } )
    ];
  } else {
    return null;
  }
});
