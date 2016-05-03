Transactions = new Mongo.Collection("transactions");

if (Transactions) {
  console.log("Transactions DEFINED.")
}

Transactions.allow({
  insert: function(userId, transaction) {
    return userId; // && transaction.createdBy === userId;
  },
  update: function(userId, transaction, fields, modifier) {
    return userId; // && transaction.createdBy === userId;
  },
  remove: function(userId, transaction) {
    return userId; // && transaction.createdBy === userId;
  }
});
