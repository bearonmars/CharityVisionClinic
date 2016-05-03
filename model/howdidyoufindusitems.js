HowDidYouFindUsItems = new Mongo.Collection("howDidYouFindUsItems");

if (HowDidYouFindUsItems) {
  console.log("HowDidYouFindUsItems DEFINED.")
}

HowDidYouFindUsItems.allow({
  insert: function(userId, item) {
    return userId; // && item.createdBy === userId;
  },
  update: function(userId, item, fields, modifier) {
    return userId; // && item.createdBy === userId;
  },
  remove: function(userId, item) {
    return userId; // && item.createdBy === userId;
  }
});
