Clinics = new Mongo.Collection("clinics");

if (Clinics) {
  console.log("Clinics DEFINED.")
}

Clinics.allow({
  insert: function(userId, clinic) {
    return userId; // && clinic.createdBy === userId;
  },
  update: function(userId, clinic, fields, modifier) {
    return userId; // && clinic.createdBy === userId;
  },
  remove: function(userId, clinic) {
    return userId; // && clinic.createdBy === userId;
  }
});
