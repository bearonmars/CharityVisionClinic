Reasons = new Mongo.Collection("reasons");

if (Reasons) {
  console.log("Reasons DEFINED.")
}

Reasons.allow({
  insert: function(userId, reason) {
    return userId; // && reason.createdBy === userId;
  },
  update: function(userId, reason, fields, modifier) {
    return userId; // && reason.createdBy === userId;
  },
  remove: function(userId, reason) {
    return userId; // && reason.createdBy === userId;
  }
});
