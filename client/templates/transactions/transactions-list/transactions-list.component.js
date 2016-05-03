angular.module('clinicApp').directive('transactionsList', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/transactions/transactions-list/transactions-list.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive) {
      $reactive(this).attach($scope);

      this.reverse = false;
      this.newTransaction = {};
      this.perPage = 10;
      this.page = 1;
      this.sort = {
        created: -1
      };
      this.sortBy = 'created';
      this.reverse = false;
      this.searchText = '';
      this.balance = 0.00;
      this.totalBalance = 0.00;

      this.helpers({
        extendedTransactions: () => {
          var transactions = Transactions.find({}, {
            sort: this.getReactively('sort')
          });

          var total = 0;
          if (transactions !== null && transactions !== undefined) {
            angular.forEach(transactions, function(value, key) {
              total += value.balance;
            });
          };
          var ret = {
            transactions: transactions.fetch(),
            totalBalance: total
          };
          return ret;
        },
        transactionsCount: () => {
          var count = Counts.get('numberOfTransactions');
          return count;
        },
        TotalBalance: () => {
          var total = 0;
          if (this.transactions !== null && this.transactions !== undefined) {
            angular.forEach(this.transactions, function(value, key) {
              total += value.balance;
            });
          }
          return total;
        }
      });

      this.subscribe('transactions', () => {
        return [{
            limit: parseInt(this.perPage),
            skip: parseInt((this.getReactively('page') - 1) * this.perPage),
            sort: this.getReactively('sort')
          },
          this.getReactively('searchText'),
          this.getReactively('balance')
        ]
      });

      this.addTransaction = () => {
        this.newTransaction.createdBy = Meteor.user()._id;
        Transactions.insert(this.newTransaction);
        this.newTransaction = {};
      };

      this.removeTransaction = (transaction) => {
        if (window.confirm("Delete? OK or Cancel")) {
          Transactions.remove({
            _id: transaction._id
          });
        }
      };

      this.pageChanged = (newPage) => {
        this.page = newPage;
      };

      this.updateSort = () => {
        this.reverse = !this.reverse;
        if (this.sortBy == "created") {
          if (this.reverse) {
            this.sort = {
              created: -1
            };
          } else {
            this.sort = {
              created: 1
            };
          }
        } else if (this.sortBy == "patient.name") {
          if (this.reverse) {
            this.sort = {
              "patient.name": -1
            };
          } else {
            this.sort = {
              "patient.name": 1
            };
          }
        }
      };

      this.getItems = function(items) {
        var result = "";
        var keepGoing = true;
        angular.forEach(items, function(value, key) {
          if (keepGoing) {
            if (result.length > 15) {
              result += "...";
              keepGoing = false;
            } else {
              if (result === "") {
                result = value["name"];
              } else {
                result += ", " + value["name"];
              }
            }
          }
        });

        return result;
      };
    }
  }
});
