Products = new Mongo.Collection("products");

if (Products) {
  console.log("Products DEFINED.")
}

Products.allow({
  insert: function(userId, product) {
    return userId; // && product.createdBy === userId;
  },
  update: function(userId, product, fields, modifier) {
    return userId; // && product.createdBy === userId;
  },
  remove: function(userId, product) {
    return userId; // && product.createdBy === userId;
  }
});
