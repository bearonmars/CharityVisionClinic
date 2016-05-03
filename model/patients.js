Patients = new Mongo.Collection("patients");

if (Exams) {
  console.log("Patients DEFINED.")
}

Patients.allow({
  insert: function (userId, patient) {
    return userId;// && patient.createdBy === userId;
  },
  update: function (userId, patient, fields, modifier) {
    return userId;// && patient.createdBy === userId;
  },
  remove: function (userId, patient) {
    return userId;// && patient.createdBy === userId;
  }
});
