Exams = new Mongo.Collection("exams");

if (Exams) {
  console.log("Exams DEFINED.")
}

Exams.allow({
  insert: function(userId, exam) {
    return userId; // && exam.createdBy === userId;
  },
  update: function(userId, exam, fields, modifier) {
    return userId; // && exam.createdBy === userId;
  },
  remove: function(userId, exam) {
    return userId; // && exam.createdBy === userId;
  }
});
