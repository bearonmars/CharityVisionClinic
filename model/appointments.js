Appointments = new Mongo.Collection("appointments");

if (Appointments) {
  console.log("Appointments DEFINED.")
}

Appointments.allow({
  insert: function(userId, appointment) {
    return userId; // && appointment.createdBy === userId;
  },
  update: function(userId, appointment, fields, modifier) {
    return userId; // && appointment.createdBy === userId;
  },
  remove: function(userId, appointment) {
    return userId; // && appointment.createdBy === userId;
  }
});
