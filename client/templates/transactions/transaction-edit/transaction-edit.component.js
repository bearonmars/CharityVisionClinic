angular.module('clinicApp').directive('transactionEdit', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/transactions/transaction-edit/transaction-edit.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive, $state, $stateParams) {
      $reactive(this).attach($scope);
      this.transactionId = $stateParams.transactionId;
      this.transaction = {
        items: []
      };
      this.subscribe('transactions');
      this.subscribe('products');
      this.subscribe('doctorNames');
      this.selectedItemId = "";
      this.modified = false;

      this.helpers({
        transaction: () => {
          var found = Transactions.findOne({
            _id: $stateParams.transactionId
          });

          if (found !== undefined && found.discountPercentage == 0) {
            found.discountPercentage = "";
          }
          return found;
        },
        products: () => {
          return Products.find();
        },
        doctors: () => {
          return Doctors.find();
        },
        isFinanceUser: () => {
          var isFinanceUser = Roles.userIsInRole(Meteor.userId(), 'Finance') || Roles.userIsInRole(Meteor.userId(), 'Admin')
          if (Meteor.user()) {
            return isFinanceUser;
          }
          return "";
        }
      });

      this.addItem = () => {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }
        // console.log('here');
        // console.log('this.selectedItemId = ' + this.selectedItemId);
        if (this.selectedItemId) {
          var product = Products.findOne({
            _id: this.selectedItemId
          });
          // console.log('prodct');
          // console.log(product);
          this.transaction.items.push({
            name: product.name,
            price: product.price,
            isDoctorProduct: product.isDoctorProduct
          });

          this.getBalance();
          this.selectedItemId = "";
          this.modified = true;
        }
      };

      this.getSubtotal = function() {
        //console.log('getSubtotal called');
        var sum = 0;
        if (this.transaction) {
          for (var i = 0; i < this.transaction.items.length; i++) {
            sum += this.transaction.items[i].price;
          }
        }
        return sum;
      }

      this.getDiscount = function() {
        if (!this.transaction) return 0;

        var discountPercentage = this.transaction.discountPercentage;
        if (!discountPercentage) {
          discountPercentage = 0;
        }
        //console.log('getDiscount called');
        return this.getSubtotal() * (discountPercentage / 100);
      }

      this.getTotal = function() {
        //console.log('getTotal called');
        var sum = this.getSubtotal() - this.getDiscount();
        return sum;
      }

      this.getPaymentTotal = function() {
        var sum = 0;
        if (this.transaction && this.transaction.payments) {
          for (var i = 0; i < this.transaction.payments.length; i++) {
            sum += this.transaction.payments[i].paymentAmount;
          }
        }
        return sum;
      }

      this.getBalance = function() {
        if (this.transaction) {
          return this.getTotal() - this.getPaymentTotal();
        }
        return 0;
      }

      this.removeItem = function(index) {
        this.transaction.items.splice(index, 1);
        this.modified = true;
      };

      this.paymentAmount = "";

      this.addPayment = function() {
        var payment = this.paymentAmount;
        if (payment === "")
          payment = 0;
        if (payment > 0) {
          this.transaction.payments.push({
            paymentAmount: payment,
            paidByInsurance: this.paidByInsurance,
            paymentDate: new Date()
          });
          this.modified = true;
          this.paymentAmount = "";
        }
      };

      this.removePayment = function(index) {
        this.transaction.payments.splice(index, 1);
        this.modified = true;
      };

      this.updateTransaction = () => {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }


        //delete hashkey and get doctor
        angular.forEach(this.transaction.items, function(value, key) {
          delete value.$$hashKey

          if (value.doctor && value.doctor._id) {
            value.doctor = Doctors.findOne({
              _id: value.doctor._id
            });
          }
        });

        angular.forEach(this.transaction.payments, function(value, key) {
          delete value.$$hashKey
        });

        Transactions.update({
          _id: this.transactionId
        }, {
          $set: {
            items: this.transaction.items,
            subtotal: this.getSubtotal(),
            discountPercentage: this.transaction.discountPercentage,
            discount: this.getDiscount(),
            total: this.getTotal(),
            payments: this.transaction.payments,
            paymentTotal: this.getPaymentTotal(),
            balance: this.getBalance(),
            update: new Date(),
            updateBy: Meteor.userId
          }
        }, function(error, result) {
          if (error) {
            console.log('Oops, unable to update the transaction...');
          } else {
            // $state.go('transactions');
            // this.transaction = {};
          }
        });
        this.modified = false;
      }, (error) => {
        if (error) {
          console.log('Oops, unable to update the transaction...');
        } else {
          console.log('Done!');
        }
      };
    }
  }
});
