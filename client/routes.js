angular.module('clinicApp')
  .config(function($urlRouterProvider, $stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('home', {
        url: '/',
        template: '<home-index></home-index>'
      })
      .state('login', {
        url: '/accounts/login',
        template: '<login></login>',
      })
      .state('logout', {
        url: '/accounts/logout',
        template: '<logout></logout>',
      })
      .state('users', {
        url: '/accounts/users',
        template: '<users></users>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null || Meteor.user().roles[0] !== "Admin") {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('update', {
        url: '/accounts/update',
        template: '<update></update>',
      })
      // .state('signup', {
      //   url: '/accounts/signup',
      //   template: '<signup></signup>',
      // })
      .state('register', {
        url: '/accounts/register',
        template: '<register></register>',
        // resolve: {
        //   currentUser: ($q) => {
        //     if (Meteor.userId() == null) {
        //       return $q.reject('AUTH_REQUIRED');
        //     } else {
        //       return $q.resolve();
        //     }
        //   }
        // }
      })
      .state('patients', {
        url: '/patients',
        template: '<patients-list></patients-list>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('patientCreate', {
        url: '/patients/create',
        template: '<patient-create></patient-create>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('patientEdit', {
        url: '/patients/edit/:patientId',
        template: '<patient-edit></patient-edit>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('patientDetails', {
        url: '/patients/:patientId',
        template: '<patient-details></patient-details>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('doctors', {
        url: '/admin/doctors',
        template: '<doctors-list></doctors-list>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('doctorCreate', {
        url: '/admin/doctors/create',
        template: '<doctor-create></doctor-create>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('doctorEdit', {
        url: '/admin/doctors/edit/:doctorId',
        template: '<doctor-edit></doctor-edit>' //,
          // resolve: {
          //   currentUser: ($q) => {
          //     if (Meteor.userId() == null) {
          //       return $q.reject('AUTH_REQUIRED');
          //     } else {
          //       return $q.resolve();
          //     }
          //   }
          // }
      })
      .state('doctorDetails', {
        url: '/admin/doctors/:doctorId',
        template: '<doctor-details></doctor-details>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('appointments', {
        url: '/appointments',
        template: '<appointments-list></appointments-list>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('appointmentCreate', {
        url: '/appointments/create/:patientId',
        template: '<appointment-create></appointment-create>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('appointmentEdit', {
        url: '/appointments/edit/:appointmentId',
        template: '<appointment-edit></appointment-edit>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('transactions', {
        url: '/transactions',
        template: '<transactions-list></transactions-list>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('transactionCreate', {
        url: '/transactions/create/:patientId',
        template: '<transaction-create></transaction-create>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('transactionEdit', {
        url: '/transactions/edit/:transactionId',
        template: '<transaction-edit></transaction-edit>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('exams', {
        url: '/exams',
        template: '<exams-list></exams-list>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('examCreate', {
        url: '/exams/create/:patientId',
        template: '<exam-create></exam-create>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('examEdit', {
        url: '/exams/edit/:examId',
        template: '<exam-edit></exam-edit>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('products', {
        url: '/admin/products',
        template: '<products-list></products-list>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('reasons', {
        url: '/admin/reasons',
        template: '<reasons-list></reasons-list>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('clinics', {
        url: '/admin/clinics',
        template: '<clinics-list></clinics-list>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('transactionsReport', {
        url: '/admin/reports/transactions',
        template: '<transactions-report></transactions-report>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('transactionsSimpleReport', {
        url: '/admin/reports/depositreport',
        template: '<deposit-report></deposit-report>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('transactionsReportByDoctor', {
        url: '/admin/reports/transactions/doctor',
        template: '<transactions-report-by-doctor></transactions-report-by-doctor>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('howdidyoufindus', {
        url: '/admin/howdidyoufindus',
        template: '<howdidyoufindus-list></howdidyoufindus-list>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      .state('additionalTests', {
        url: '/admin/additionalTests',
        template: '<additionaltests-list></additionaltests-list>',
        resolve: {
          currentUser: ($q) => {
            if (Meteor.userId() == null) {
              return $q.reject('AUTH_REQUIRED');
            } else {
              return $q.resolve();
            }
          }
        }
      })
      //$urlRouterProvider.otherwise("/");
  })
  .run(function($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      if (error === 'AUTH_REQUIRED') {
        $state.go('login');
        //alert("You are not authorized. Please login.");
      }
    });
  });
