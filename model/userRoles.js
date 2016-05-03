UserRoles = new Mongo.Collection("userRoles");

if (UserRoles) {
  console.log("UserRoles DEFINED.")
}

UserRoles.allow({
  insert: function(userId, userRole) {
    return userId; // && userRole.createdBy === userId;
  },
  update: function(userId, userRole, fields, modifier) {
    return userId; // && userRole.createdBy === userId;
  },
  remove: function(userId, userRole) {
    return userId; // && userRole.createdBy === userId;
  }
});
