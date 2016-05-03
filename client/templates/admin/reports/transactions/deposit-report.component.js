function getDateWithSlash(dateTime) {
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  return month + "/" + day + "/" + year;
};

angular.module('clinicApp').directive('depositReport', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/admin/reports/transactions/deposit-report.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive) {
        $reactive(this).attach($scope);

        this.startDate = "";
        this.endDate = "";
        this.download = false;
        this.amountOrCount = "amount";

        this.subscribe('products');

        this.subscribe('transactionsReport', () => {
          return [this.getReactively('startDate'), this.getReactively('endDate')]
        }, {
          onReady: function() {
            console.log("onReady And the Items actually Arrive", arguments);
            //subscriptionHandle.stop(); // Stopping the subscription, will cause onStop to fire
          },
          onStop: function(error) {
            if (error) {
              console.log('An error happened - ', error);
            } else {
              console.log('The subscription stopped');
            }
          }
        });

        this.predefinedDateSelection = "";

        this.populateDates = function() {
            if (this.predefinedDateSelection == "weekToDate") {
              this.startDate = getDateWithSlash(Date.today().previous().sunday());
              this.endDate = getDateWithSlash(Date.today());
            } else if (this.predefinedDateSelection == "lastWeek") {
              this.startDate = getDateWithSlash(Date.today().previous().sunday().previous().sunday());
              this.endDate = getDateWithSlash(Date.today().previous().saturday());
            } else if (this.predefinedDateSelection == "monthToDate") {
              var date = new Date();
              var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
              var lastDay = Date.today();
              this.startDate = getDateWithSlash(firstDay);
              this.endDate = getDateWithSlash(lastDay);
            } else if (this.predefinedDateSelection == "lastMonth") {
              var date = new Date();
              var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
              var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
              this.startDate = getDateWithSlash(firstDay);
              this.endDate = getDateWithSlash(lastDay);
            } else {
              this.startDate = "";
              this.endDate = "";
              return;
            }
            // this.generateReport(); //this doesn't work well with weekToDate -> subscription keeps stopping.
          } //end of this.populateDates = function() {

        this.reportData = [];
        this.columnHeaders = [];
        this.rowHeaders = [];

        this.downloadReport = function() {
          this.download = true;
          this.generate();
        }

        this.generateReport = function() {
          this.download = false;
          this.generate();
        }

        this.generate = function() {

            var baseTransactions = getBaseTransactions();
            var payments = getPaymentsByDate(baseTransactions);
            var summarizedTransactions = getTransactionsByDate(baseTransactions);
            var flattenedTransactions = flattenTransactionsByItems(baseTransactions);

            this.columnHeaders = getColumnHeaders(this.startDate, this.endDate);
            this.rowHeaders = getRowHeaders(this.amountOrCount);

            this.reportData = [];

            //item loop
            for (var i = 0; i < this.rowHeaders.length; i++) {
              var row = [];
              var rowType = this.rowHeaders[i].rowType;
              var rowHeaderName = this.rowHeaders[i].name;
              var rowTotal = 0;

              //date loop
              for (var j = 0; j < this.columnHeaders.length; j++) {
                var date = this.columnHeaders[j];

                //itemName ==""-> empty row
                if (rowType == "empty") {
                  row.push({
                    date: date,
                    itemName: "",
                    amount: ""
                  });
                  continue;
                }
                //get amount
                var amount = 0;

                if (rowType == "charged") {
                  amount = getCharged(summarizedTransactions, date);
                } else if (rowType == "collected") {
                  amount = getCollected(payments, date);
                } else if (rowType == "totalCount") {
                  amount = getTotalCountByDate(summarizedTransactions, date);
                }

                rowTotal += amount;
                if (j == this.columnHeaders.length - 1) {
                  amount = rowTotal;
                }
                row.push({
                  date: date,
                  itemName: rowHeaderName,
                  amount: amount
                });
              }
              this.reportData.push({
                itemName: rowHeaderName,
                data: row
              });
            }

            if (this.download) {
              downloadReport(this.columnHeaders, this.reportData);
            }
          } //end of this.generate = function() {


        function downloadReport(columnHeaders, reportData) {
          var csv = ",";
          for (var i = 0; i < columnHeaders.length; i++) {
            if (i < columnHeaders.length - 1) {
              csv += columnHeaders[i] + ","
            } else {
              csv += columnHeaders[i] + "/r/n"
            }
          };

          for (var i = 0; i < reportData.length; i++) {
            var eachReportData = reportData[i];
            csv += eachReportData.itemName.replace(",", " ") + ","
            if (eachReportData.data !== undefined) {
              for (var j = 0; j < eachReportData.data.length; j++) {
                var data = eachReportData.data[j];
                if (j < eachReportData.data.length - 1) {
                  csv += data.amount + ","
                } else {
                  csv += data.amount + "/r/n"
                }
              }
            }
          }

          window.open(encodeURI('data:text/csv;filename=transactionsreport.csv;charset=utf-8,' + csv));
        } //end of function downloadReport(columnHeaders, reportData)

        function getColumnHeaders(startDate, endDate) {
          var start = new Date(startDate);
          var end = new Date(endDate);
          var days = [];
          var headers = [];
          for (var d = start; d <= end; d.setDate(d.getDate() + 1)) {
            headers.push(d.toJSON().slice(0, 10));
          }
          headers.push('Total:');

          return headers;
        };

        function getRowHeaders(amountOrCount) {
          //row headersw
          var headers = [];
          if (amountOrCount === "count") {
            headers.push({
              rowType: "totalCount",
              name: "Total Count"
            });
          } else {
            //total charged and collected rows
            headers.push({
              rowType: "charged",
              name: "Total Charged"
            });
            headers.push({
              rowType: "collected",
              name: "Total Deposited"
            });
            headers.push({
              rowType: "insuranceAmount",
              name: "Insurance Amount"
            });
          }

          return headers;
        }; //end of function getRowHeaders()

        function getBaseTransactions() {
          var baseTransactions = Transactions.find({}, {
            sort: {
              created: 1
            }
          }).fetch();
          return baseTransactions;
        }

        function getPaymentsByDate(transactions) {
          var list = [];
          var count = 0;
          var totalCollected = 0;
          var prevPaymentDate = "";

          var payments = getPaymentsFromTransactions(transactions);
          for (var i = 0; i < payments.length; i++) {
            var payment = payments[i];
            payment.paymentDate = payment.paymentDate.setHours(0, 0, 0, 0);
            if (prevPaymentDate !== "" && payment.paymentDate !== prevPaymentDate) {
              list.push({
                paymentDate: new Date(prevPaymentDate),
                type: "collected",
                count: count,
                collected: totalCollected
              });
              count = 0;
              totalCollected = 0;
            }
            count = count + 1;
            totalCollected += payment.paymentAmount;

            prevPaymentDate = payment.paymentDate;
          }

          if (count > 0) {
            list.push({
              type: "collected",
              paymentDate: new Date(prevPaymentDate),
              count: count,
              collected: totalCollected
            });
          }
          console.log("consolidated payments", list);
          return list;
        }

        function getPaymentsFromTransactions(transactions) {

          var payments = [];

          for (var i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            if (transaction.payments !== undefined && transaction.payments !== null && transaction.payments.length > 0) {
              for (var j = 0; j < transaction.payments.length; j++) {
                //transaction.payments[j].paymentDate = getDateString(transaction.payments[j].paymentDate)
                payments.push(transaction.payments[j]);
              }
            }
          }

          payments.sort(function(a, b) {
            var keyA = a.paymentDate,
              keyB = b.paymentDate;
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });

          console.log("payments", payments);
          return payments;
        }; //end of function getPaymentsFromTransactions(transactions)

        function getTransactionsByDate(transactions) {
          var list = [];
          var prevTransaction = {
            createdDate: null
          };
          var count = 0;
          var totalCharged = 0;
          var totalCollected = 0;
          var totalInsuranceAmount = 0;
          for (var i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            transaction.createdDate = transaction.created.setHours(0, 0, 0, 0);
            if (prevTransaction.createdDate !== null && transaction.createdDate !== prevTransaction.createdDate) {
              list.push({
                createdDate: new Date(prevTransaction.createdDate),
                type: "charged_collected",
                count: count,
                charged: totalCharged,
                collected: totalCollected,
                insuranceAmount: totalInsuranceAmount
              });
              count = 0;
              totalCharged = 0;
              totalCollected = 0;
              totalInsuranceAmount = 0;
            }
            count = count + transaction.items.length;
            totalCharged += transaction.total;
            totalCollected += transaction.paymentTotal;
            if (transaction.payments !== undefined && transaction.payments !== null) {
              for (var p = 0; p < transaction.payments.length; p++) {
                var payment = transaction.payments[p];
                if (payment.paidByInsurance !== undefined && payment.paidByInsurance !== null && payment.paidByInsurance) {
                  totalInsuranceAmount += payment.paymentAmount;
                }
              }
            }
            prevTransaction = transaction;
          }

          if (count > 0) {
            list.push({
              type: "charged_collected",
              createdDate: new Date(prevTransaction.createdDate),
              count: count,
              charged: totalCharged,
              collected: totalCollected,
              insuranceAmount: totalInsuranceAmount
            });
          }
          return list;
        }; //end of function getTransactionsByDate(transactions)

        function flattenTransactionsByItems(transactions) {
          var list = [];
          var prevItem = [];
          var key = "";
          for (var i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            for (var j = 0; j < transaction.items.length; j++) {
              var item = transaction.items[j];
              list.push({
                createdDate: transaction.created.setHours(0, 0, 0, 0),
                itemName: item.name,
                itemPrice: item.price,
                doctorName: item.doctor === undefined ? "" : item.doctor.name
              });
            }
          }
          return list;
        } //end of function flattenTransactionsByItems(transactions)

        function sortByCreatedDateAndItemName(flattendTransactions) {
          flattendTransactions.sort(function(a, b) {
            var keyA = a.createdDate + "_" + a.itemName,
              keyB = b.createdDate + "_" + b.itemName;
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
          return flattendTransactions;
        } //end of function sortByCreatedDateAndItemName(flattendTransactions)

        function getAmountOrCount(transactions, date, itemName, amountOrCount) {
          for (var i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            if (transaction.type !== "item") continue;
            if (getDateString(transaction.createdDate) === date && transaction.itemName === itemName) {
              if (amountOrCount === "amount") {
                return transaction.sum;
              } else {
                return transaction.count;
              }
            }
          }
          return 0;
        } //end of function getAmountOrCount(transactions, date, itemName, amountOrCount)

        function getTotalCountByDate(transactions, date) {
          for (var i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            if (transaction.type !== "charged_collected") continue;
            if (getDateString(transaction.createdDate) === date) {
              return transaction.count
            }
          }
          return 0;
        } //end of function getChargedCollected(transactions, date, isCharged)

        function getCharged(transactions, date) {
          for (var i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            if (transaction.type !== "charged_collected") continue;
            if (getDateString(transaction.createdDate) === date) {
              return transaction.charged;
            }
          }
          return 0;
        } //end of function getCharged(transactions, date)

        function getCollected(payments, date) {
          for (var i = 0; i < payments.length; i++) {
            var payment = payments[i];
            console.log(getDateString(payment.paymentDate), date)
            if (getDateString(payment.paymentDate) === date) {
              console.log("payment.collected", payment.collected);
              return payment.collected;
            }
          }
          return 0;
        } //end of function getCollected(payments, date)

        function getDateString(dateTime) {
          return dateTime.toJSON().slice(0, 10);
        }; //end of function getDateString(dateTime)

      } //end of controller function()
  } //end of return statement
}); //end of directive
