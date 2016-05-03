AdditionalTests = new Mongo.Collection("additionalTests");

if (AdditionalTests) {
  console.log("AdditionalTests DEFINED.")
}

AdditionalTests.allow({
  insert: function(userId, additionalTest) {
    return userId; // && additionalTest.createdBy === userId;
  },
  update: function(userId, additionalTest, fields, modifier) {
    return userId; // && additionalTest.createdBy === userId;
  },
  remove: function(userId, additionalTest) {
    return userId; // && additionalTest.createdBy === userId;
  }
});
