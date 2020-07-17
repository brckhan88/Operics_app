// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

  .run(function ($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs).
      // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
      // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
      // useful especially with forms, though we would prefer giving the user a little more room
      // to interact with the app.
      if (window.cordova && window.Keyboard) {
        window.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        // Set the statusbar to use the default style, tweak this to
        // remove the status bar on iOS or change it to use white instead of dark colors.
        StatusBar.styleDefault();
      }

      function getLanguage() {
        this.globalization.getPreferredLanguage(onSuccess,onError);

        function onSuccess(locale) {
          //alert('locale: ' +locale.value.split("-")[0]);
          var lang = locale.value.split("-")[0];
          console.log(lang);

          if (lang == 'tr') {
            localStorage.setItem('language', "TR");
          } else if(lang == 'de') {
            localStorage.setItem('language', "DE");
          } else {
            localStorage.setItem('language', "EN");
          }
        }

        function onError() {
          localStorage.setItem('language', "EN");;
        }
      }


      getLanguage();
    });

  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // setup an independent states

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'MainCtrl'
      })

      .state('sms', {
        url: '/sms',
        templateUrl: 'templates/sms.html',
        controller: 'MainCtrl'
      })

      // setup an abstract state for the tabs directive

      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'MainCtrl'
      })

      // Each tab has its own nav history stack:

      .state('tab.profile', {
        url: '/profile',
        views: {
          'tab-profile': {
            templateUrl: 'templates/tab-profile.html'
          }
        }
      })

      .state('tab.main', {
        url: '/main',
        views: {
          'tab-main': {
            templateUrl: 'templates/tab-main.html'
          }
        }
      })

      .state('tab.aboutus', {
        url: '/aboutus',
        views: {
          'tab-aboutus': {
            templateUrl: 'templates/tab-aboutus.html'
          }
        }
      })

      .state('tab.dictionary', {
        url: '/dictionary',
        views: {
          'tab-dictionary': {
            templateUrl: 'templates/tab-dictionary.html'
          }
        }
      })
      .state('tab.courses', {
        url: '/courses',
        views: {
          'tab-courses': {
            templateUrl: 'templates/tab-courses.html'
          }
        }
      })
      .state('tab.contact', {
        url: '/contact',
        views: {
          'tab-contact': {
            templateUrl: 'templates/tab-contact.html'
          }
        }
      })
      /*
      .state('tab.userprofile', {
        url: '/',
        views: {
          'tab-sms': {
            templateUrl: 'templates/tab-profile.html'
          }
        }
      })
      */
      ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  });
