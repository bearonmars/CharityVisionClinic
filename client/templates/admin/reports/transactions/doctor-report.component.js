function getDateWithSlash(dateTime) {
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  return month + "/" + day + "/" + year;
};

angular.module('clinicApp').directive('transactionsReportByDoctor', function() {
  return {
    restrict: 'E',
    templateUrl: 'client/templates/admin/reports/transactions/doctor-report.html',
    controllerAs: 'vm',
    controller: function($scope, $reactive) {
        $reactive(this).attach($scope);

        this.startDate = "";
        this.endDate = "";
        this.selectedDoctorId = "";
        this.download = false;
        this.amountOrCount = "amount"
        this.discountFilter = "";

        this.subscribe('products');
        this.subscribe('doctorNames');

        this.subscribe('transactionsReport', () => {
          return [this.getReactively('startDate'), this.getReactively('endDate'), this.getReactively('selectedDoctorId')]
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

        this.helpers({
          doctors: () => {
            var found = Doctors.find();
            return found;
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

            if (this.selectedDoctorId === -1 || this.selectedDoctorId === "") {
              alert("select a doctor.");
              return;
            }
            var baseTransactions = getBaseTransactions(this.discountFilter);
            // var summarizedTransactions = getTransactionsByDate(baseTransactions);
            var flattenedTransactions = flattenTransactionsByItems(baseTransactions, this.selectedDoctorId);
            var summarizedTransactions = getTransactionsByDate(flattenedTransactions);
            var transactionsByProduct = getTransactionsByProduct(flattenedTransactions);
            // var transactionsByDoctor = getTransactionsByDoctor(flattenedTransactions);
            var uniqueProductNames = getUniqueProductNames(transactionsByProduct);
            // var uniqueDoctorNames = getUniqueDoctorNames(transactionsByDoctor);

            this.columnHeaders = getColumnHeaders(this.startDate, this.endDate);
            //this.rowHeaders = getRowHeaders(uniqueProductNames, uniqueDoctorNames);
            this.rowHeaders = getRowHeaders(this.amountOrCount, uniqueProductNames);

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
                if (rowType == "charged") {
                  amount = getChargedCollected(summarizedTransactions, date, true);
                } else if (rowType == "totalCount") {
                  amount = getTotalCountByDate(summarizedTransactions, date);
                } else {
                  amount = getAmountOrCount(transactionsByProduct, date, rowHeaderName, this.amountOrCount);
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
              csv += columnHeaders[i] + "\r\n"
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
                  csv += data.amount + "\r\n"
                }
              }
            }
          }

          window.open(encodeURI('data:text/csv;charset=utf-8;filename=doctorreport.csv,' + csv));
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

        // function getRowHeaders(uniqueProductNames, uniqueDoctorNames) {
        function getRowHeaders(amountOrCount, uniqueProductNames) {
          //row headersw
          var headers = [];

          if (amountOrCount === "count") {
            headers.push({
              rowType: "totalCount",
              name: "Total Count"
            });
          } else {
            //total charged
            headers.push({
              rowType: "charged",
              name: "Total Charged"
            });
          }

          //product names
          for (var i = 0; i < uniqueProductNames.length; i++) {
            headers.push({
              rowType: "product",
              name: uniqueProductNames[i]
            });
          }

          return headers;
        }; //end of function getRowHeaders()

        function getBaseTransactions(discountFilter) {
          if (discountFilter) {
            var patientIds = _.uniq(Transactions.find({
              discountPercentage: {
                $gte: discountFilter
              }
            }).map(function(transaction) {
              return transaction.patient._id;
            }), true);

            var filteredTransactions = Transactions.find({
              "patient._id": {
                $in: patientIds
              }
            }, {
              sort: {
                created: 1
              }
            }).fetch();

            return filteredTransactions;
          }

          var baseTransactions = Transactions.find({}, {
            sort: {
              created: 1
            }
          }).fetch();
          return baseTransactions;
        }

        function getTransactionsByDate(transactions) {
          var list = [];
          var prevTransaction = {
            createdDate: null
          };
          var count = 0;
          var totalCharged = 0;
          for (var i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            console.log("transaction.createdDate", transaction.createdDate);
            console.log("new Date(transaction.createdDate)", new Date(transaction.createdDate));
            // transaction.createdDate = transaction.createdDate.setHours(0, 0, 0, 0);
            if (prevTransaction.createdDate !== null && transaction.createdDate !== prevTransaction.createdDate) {
              list.push({
                createdDate: new Date(prevTransaction.createdDate),
                type: "charged_collected",
                count: count,
                charged: totalCharged,
              });
              count = 0;
              totalCharged = 0;
            }
            count = count + 1;
            totalCharged += transaction.itemPrice;

            prevTransaction = transaction;

          }

          if (count > 0) {
            list.push({
              type: "charged_collected",
              createdDate: new Date(prevTransaction.createdDate),
              count: count,
              charged: totalCharged,
            });
          }
          return list;
        }; //end of function getTransactionsByDate(transactions)

        function flattenTransactionsByItems(transactions, selectedDoctorId) {
          var list = [];
          var prevItem = [];
          var key = "";
          for (var i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            for (var j = 0; j < transaction.items.length; j++) {
              var item = transaction.items[j];
              console.log("item", item);
              console.log("item.doctor", item.doctor);
              if (item.doctor !== undefined && item.doctor !== null) {
                if (item.doctor._id === selectedDoctorId) {
                  list.push({
                    createdDate: getDateString(transaction.created), //.setHours(0, 0, 0, 0),
                    itemName: item.name,
                    itemPrice: item.price,
                    doctorName: item.doctor === undefined || item.doctor === null ? "" : item.doctor.name,
                    doctorId: item.doctor === undefined || item.doctor === null ? 0 : item.doctor._id
                  });
                }
              }
            }
          }
          console.log("flattenTransactionsByItems", list);
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

        function sortByCreatedDateAndDoctorName(flattendTransactions) {
          flattendTransactions.sort(function(a, b) {
            var keyA = a.createdDate + "_" + a.itemName,
              keyB = b.createdDate + "_" + b.doctorName;
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
          return flattendTransactions;
        } //end of function sortByCreatedDateAndDoctorName(flattendTransactions)

        function getTransactionsByProduct(flattenedTransactions) {
          var sortedFlattenedTransactions = sortByCreatedDateAndItemName(flattenedTransactions);
          var list = [];
          var prevTransaction = {};
          var key = "";
          var prevKey = null;
          var count = 0;
          var sum = 0;
          for (var i = 0; i < sortedFlattenedTransactions.length; i++) {
            var transaction = sortedFlattenedTransactions[i];
            key = transaction.createdDate + "_" + transaction.itemName;
            if (prevKey !== null && key !== prevKey) {
              list.push({
                type: "item",
                createdDate: new Date(prevTransaction.createdDate),
                itemName: prevTransaction.itemName,
                count: count,
                sum: sum,
              });
              count = 0;
              sum = 0;
            }
            count++;
            sum += transaction.itemPrice;
            prevKey = key;
            prevTransaction = transaction;

            if (i === sortedFlattenedTransactions.length - 1) {
              list.push({
                type: "item",
                createdDate: new Date(transaction.createdDate),
                itemName: transaction.itemName,
                count: count,
                sum: sum,
              });
            }
          }
          return list;
        }; //end of function getTransactionsByProduct(sortedFlattenedTransactions)

        function getTransactionsByDoctor(flattenedTransactions) {
          var sortedFlattenedTransactions = sortByCreatedDateAndDoctorName(flattenedTransactions);
          var list = [];
          var prevTransaction = {};
          var key = "";
          var prevKey = null;
          var count = 0;
          var sum = 0;
          for (var i = 0; i < sortedFlattenedTransactions.length; i++) {
            var transaction = sortedFlattenedTransactions[i];
            if (transaction.doctorName === "") continue;
            key = transaction.createdDate + "_" + transaction.doctorName;
            if (prevKey !== null && key !== prevKey) {
              list.push({
                type: "doctor",
                createdDate: new Date(prevTransaction.createdDate),
                doctorName: prevTransaction.doctorName,
                count: count,
                sum: sum,
              });
              count = 0;
              sum = 0;
            }
            count++;
            sum += transaction.itemPrice;
            prevKey = key;
            prevTransaction = transaction;
          }

          if (count > 0) {
            list.push({
              type: "doctor",
              createdDate: new Date(prevTransaction.createdDate),
              doctorName: prevTransaction.doctorName,
              count: count,
              sum: sum,
            });
          }

          return list;
        }; //end of function getTransactionsByDoctor(flattenedTransactions)

        function getUniqueProductNames(transactionsByProduct) {
          var products = sortByProductName(transactionsByProduct);
          var uniqueNames = [];
          var prevName = ""
          for (var i = 0; i < products.length; i++) {
            if (products[i].itemName !== prevName) {
              uniqueNames.push(products[i].itemName);
            }
            prevName = products[i].itemName;
          }

          return uniqueNames;
        } //end of function getUniqueProductNames(transactionsByProduct)

        function sortByProductName(flattendTransactions) {
          flattendTransactions.sort(function(a, b) {
            var keyA = a.itemName,
              keyB = b.itemName;
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
          return flattendTransactions;
        }

        function getUniqueDoctorNames(transactionsByDoctor) {
          var doctors = sortByDoctorName(transactionsByDoctor);
          var uniqueNames = [];
          var prevName = ""
          for (var i = 0; i < doctors.length; i++) {
            if (doctors[i].doctorName !== prevName) {
              uniqueNames.push(doctors[i].doctorName);
            }
            prevName = doctors[i].doctorName;
          }

          return uniqueNames;
        } //end of function getUniqueDoctorNames(transactionsByDoctor)

        function sortByDoctorName(flattendTransactions) {
          flattendTransactions.sort(function(a, b) {
            var keyA = a.doctorName,
              keyB = b.doctorName;
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
          return flattendTransactions;
        }

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

        function getDoctorAmountOrCount(transactions, date, doctorName, amountOrCount) {
          for (var i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            if (transaction.type !== "doctor") continue;
            if (getDateString(transaction.createdDate) === date && transaction.doctorName === doctorName) {
              if (amountOrCount === "amount") {
                return transaction.sum;
              } else {
                return transaction.count;
              }
            }
          }
          return 0;
        } //end of function getDoctorAmountOrCount(transactions, date, doctorName, amountOrCount)

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

        function getChargedCollected(transactions, date, isCharged) {
          for (var i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            if (transaction.type !== "charged_collected") continue;
            if (getDateString(transaction.createdDate) === date) {
              if (isCharged) {
                return transaction.charged;
              }
              return transaction.collected;
            }
          }
          return 0;
        } //end of function getChargedCollected(transactions, date, isCharged) {

        function getDateString(dateTime) {
          return dateTime.toJSON().slice(0, 10);
        }; //end of function getDateString(dateTime) {

      } //end of controller function()
  } //end of return statement
}); //end of directive
