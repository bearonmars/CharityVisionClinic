function getDateOnly(dateTime, hour) {
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth();
  var day = dateTime.getDate();
  return new Date(year, month, day, hour, 0);
};

angular.module('clinicApp').directive('transactionCreate', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/transactions/transaction-create/transaction-create.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive, $state, $stateParams) {
      $reactive(this).attach($scope);
      this.patientId = $stateParams.patientId;
      this.subscribe('patientNames');
      this.subscribe('products');
      this.subscribe('doctorNames');
      this.items = [];
      this.newTransaction = {};
      this.selectedItemId = "";
      this.subtotal = 0;
      this.discountPercentage = "";
      this.discount = 0;
      this.total = 0;

      this.helpers({
        patient: () => {
          return Patients.findOne({
            _id: $stateParams.patientId
          });
        },
        products: () => {
          return Products.find();
        },
        doctors: () => {
          return Doctors.find();
        }
      });

      this.addItem = () => {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }
        if (this.selectedItemId) {
          var product = Products.findOne({
            _id: this.selectedItemId
          });
          this.items.push({
            name: product.name,
            price: product.price,
            isDoctorProduct: product.isDoctorProduct
          });

          this.selectedItemId = "";
        }
      };
      this.getSubtotal = function() {
        var sum = 0;
        if (this.items) {
          for (var i = 0; i < this.items.length; i++) {
            sum += this.items[i].price;
          }
        }
        return sum;
      }

      this.getDiscount = function() {
        var discount = this.discountPercentage;
        if (!discount) {
          discount = 0;
        }
        return this.getSubtotal() * (discount / 100);
      }

      this.getTotal = function() {
        var sum = this.getSubtotal() - this.getDiscount();
        return sum;
      }
      this.removeItem = function(index) {
        this.items.splice(index, 1);
        this.getDiscount();
      };

      this.addTransaction = () => {
        if (!Meteor.userId) {
          throw new Meteor.Error(500, 'access denied.');
        }

        for (var i = 0; i < this.items.length; i++) {
          var item = this.items[i];
          if (item.doctor && item.doctor._id) {
            item.doctor = Doctors.findOne({
              _id: item.doctor._id
            });
          }
        }

        var now = new Date();
        var dateOnly = getDateOnly(now, 0);
        this.newTransaction.patient = this.patient;
        this.newTransaction.items = this.items;
        this.newTransaction.subtotal = this.getSubtotal();
        this.newTransaction.discountPercentage = this.discountPercentage;
        this.newTransaction.discount = this.getDiscount();
        this.newTransaction.total = this.getTotal();
        this.newTransaction.payments = [];
        this.newTransaction.paymentTotal = 0;
        this.newTransaction.balance = this.newTransaction.total;
        this.newTransaction.created = now;
        this.newTransaction.createdBy = Meteor.userId;
        // this.newTransaction.createdDate = dateOnly;

        //delete hashkey
        angular.forEach(this.newTransaction.items, function(value, key) {
          delete value.$$hashKey
        });

        Transactions.insert(this.newTransaction, function(error, result) {
          if (error) {
            console.log('Oops, unable to create the transaction...');
          } else {
            $state.go('transactions');
            this.newTransaction = {};
          }
        });
      }, (error) => {
        if (error) {
          console.log('Oops, unable to create the transaction...');
        } else {
          console.log('Done!');
        }
      };
    }
  }
});
