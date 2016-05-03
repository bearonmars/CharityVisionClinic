angular.module('clinicApp').directive('productsList', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/admin/products/products-list/products-list.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive) {
      $reactive(this).attach($scope);

      this.reverse = false;
      this.perPage = 10;
      this.page = 1;
      this.sort = {
        name: 1
      };
      this.sortBy = 'name';
      this.reverse = false;
      this.searchText = '';

      this.subscribe('products', () => {
        return [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
          },
          this.getReactively('searchText')
        ]
      });

      this.helpers({
        products: () => {
          var list = Products.find({}, {
            sort: this.getReactively('sort')
          });
          return list;
        },
        productsCount: () => {
          var count = Counts.get('numberOfProducts');
          return count;
        }
      });

      this.newProduct = {};

      this.addProduct = function() {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }
        this.newProduct.created = new Date();
        this.newProduct.createdBy = Meteor.userId;
        Products.insert(this.newProduct, function(error, result) {
          if (error) {
            console.log('Oops, unable to create the product...');
          } else {
            console.log('the new product was added!');
          }
        });

        this.newProduct = {};
      };

      this.removeProduct = (product) => {
        if (window.confirm("Delete? OK or Cancel")) {
          Products.remove({
            _id: product._id
          });
        }
      };

      this.updateProduct = function(product) {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }

        Products.update({
          _id: product._id
        }, {
          $set: {
            name: product.name,
            price: product.price,
            isDoctorProduct: product.isDoctorProduct
          }
        });
      };

      this.pageChanged = (newPage) => {
        this.page = newPage;
      };

      this.updateSort = () => {
        this.reverse = !this.reverse;
        if (this.sortBy == "name") {
          if (this.reverse) {
            this.sort = {
              name: -1
            };
          } else {
            this.sort = {
              name: 1
            };
          }
        } else if (this.sortBy == "price") {
          if (this.reverse) {
            this.sort = {
              price: -1
            };
          } else {
            this.sort = {
              price: 1
            };
          }
        }
      };
    }
  }
});
