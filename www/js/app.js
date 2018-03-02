// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'LocalStorageModule', 'vcRecaptcha', 'mgo-angular-wizard', 'ngCordova', 'ionic-datepicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.login', {
    url: '/cc/login',
    views: {
      'menuContent': {
        templateUrl: 'Components/Login/LoginView.html',
        controller: 'LoginController'
      }
    }
  })

  .state('app.signup', {
    url: '/cc/signup',
    views: {
      'menuContent': {
        templateUrl: 'Components/Signup/SignupView.html',
        controller: 'SignupController'
      }
    }
  })

  .state('app.reminder', {
    url: '/cc/reminder/:key',
    views: {
      'menuContent': {
        templateUrl: 'Components/Reminder/ReminderView.html',
        controller: 'ReminderController'
      }
    }
  })

  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'MobileComponents/Dashboard/DashboardView.html'
      }
    }
  })

  .state('app.locations', {
    url: '/locations',
    views: {
      'menuContent': {
        templateUrl: 'MobileComponents/Locations/LocationsView.html'
      }
    }
  })

  .state('app.location', {
    url: '/location/{key}',
    views: {
      'menuContent': {
        templateUrl: 'MobileComponents/Locations/StoreView.html',
        controller: 'StoreController'
      }
    }
  })

  .state('app.pickup', {
    url: '/pickup',
    views: {
      'menuContent': {
        templateUrl: 'MobileComponents/Pickup/PickupView.html'
      }
    }
  })

  .state('app.services', {
    url: '/services',
    views: {
      'menuContent': {
        templateUrl: 'MobileComponents/Services/ServicesView.html'
      }
    }
  })

  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'MobileComponents/About/AboutView.html'
      }
    }
  })

  .state('app.specials', {
    url: '/specials',
    views: {
      'menuContent': {
        templateUrl: 'MobileComponents/Specials/SpecialsView.html',
        controller: 'SpecialsController'
      }
    }
  })

  .state('app.ccdashboard', {
    url: '/cc/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'Components/Dashboard/DashboardView.html'
      }
    }
  })

  .state('app.ccpickup', {
    url: '/cc/pickup',
    views: {
      'menuContent': {
        templateUrl: 'Components/Pickup/PickupView.html',
        controller: 'PickupController'
      }
    }
  })

  .state('app.ccorders', {
    url: '/cc/orders',
    views: {
      'menuContent': {
        templateUrl: 'Components/Orders/OrdersView.html',
        controller: 'OrdersController'
      }
    }
  })

  .state('app.ccaccount', {
    url: '/cc/account',
    views: {
      'menuContent': {
        templateUrl: 'Components/Account/AccountView.html'
      }
    }
  })

  .state('app.ccreferral', {
    url: '/cc/referral',
    views: {
      'menuContent': {
        templateUrl: 'Components/Referral/ReferralView.html',
        controller: 'ReferralController'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
});
