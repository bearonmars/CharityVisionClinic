var myApp = angular.module('clinicApp', [
  'angular-meteor',
  'ui.router',
  'accounts.ui',
  'angularUtils.directives.dirPagination',
  'ngMaterial'
  // 'ui.bootstrap'
]);

myApp.controller('homeController', ['$scope', '$reactive', function($scope, $reactive) {
  $reactive(this).attach($scope);

  if (Meteor.user()) {
    Session.set("userName", Meteor.user().profile.name);
  } else {
    Session.set("userName", "Log In");
  }
}]);

myApp.filter('percentage', ['$filter', function($filter) {
  return function(input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
}]);

myApp.filter('userfriendly', ['$filter', function($filter) {
  return function(input) {
    if (input) {
      return "Yes";
    }
    return "No";
  };
}]);

myApp.filter('currencyOrNumber', ['$filter', '$locale', function($filter, $locale) {
  var currency = $filter('currency'),
    formats = $locale.NUMBER_FORMATS;
  var number = $filter('number');

  return function(amount, amountOrCount) {
    if (amountOrCount === "amount") {
      var value = currency(amount);
      return value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '');
    }
    var numValue = number(amount);
    return numValue.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '');
  };
}]);


function onReady() {
  angular.bootstrap(document, ['clinicApp'], {
    strictDi: true
  });
}

if (Meteor.isCordova)
  angular.element(document).on("deviceready", onReady);
else
  angular.element(document).ready(onReady);
