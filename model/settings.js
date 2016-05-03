Settings = new Mongo.Collection("settings");

if (Settings) {
  console.log("Settings DEFINED.")
}

Settings.allow({
  insert: function(userId, setting) {
    return userId; // && setting.createdBy === userId;
  },
  update: function(userId, setting, fields, modifier) {
    return userId; // && setting.createdBy === userId;
  },
  remove: function(userId, setting) {
    return userId; // && setting.createdBy === userId;
  }
});
