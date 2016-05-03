Doctors = new Mongo.Collection("doctors");

if (Doctors) {
  console.log("Doctors DEFINED.")
}

Doctors.allow({
  insert: function(userId, doctor) {
    return userId; // && doctor.createdBy === userId;
  },
  update: function(userId, doctor, fields, modifier) {
    return userId; // && doctor.createdBy === userId;
  },
  remove: function(userId, doctor) {
    return userId; // && doctor.createdBy === userId;
  }
});
