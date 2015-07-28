'use strict';

var deferred = $.Deferred();

// Declare app level module which depends on views, and components
var app = angular.module('Dominoes', ['ionic', 'ionic.contrib.ui.tinderCards'
]).config(function ($stateProvider, $urlRouterProvider) {

    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/discover")

    $stateProvider
      .state('discover', {
          url: "/discover",
          templateUrl: "views/discover.html",
          controller: 'discoverController',
          resolve: {
              deviceReady: function () {
                  return deferred.promise();
              }
          }
      })
        .state('waiting', {
            url: "/waiting",
            templateUrl: "views/waiting.html",
            controller: 'waitingController'
        })
      .state('main', {
          url: "/main",
          templateUrl: "views/main.html",
          controller: 'mainController'
      })
        .state('winning', {
            url: "/winning",
            templateUrl: "views/winning.html",
            controller: 'winningController'
        })
     .state('loser', {
         url: "/loser",
         templateUrl: "views/loser.html",
         controller: 'loserController'
     })
}).config(['$ionicTabsConfig', function ($ionicTabsConfig) {
    // Override the Android platform default to add "tabs-striped" class to "ion-tabs" elements.
    $ionicTabsConfig.type = '';
}]);
app.run(['$ionicBackdrop', '$rootScope', '$ionicPlatform', function ($ionicBackdrop, $rootScope, $ionicPlatform) {
    $rootScope.backDrop = $ionicBackdrop;
    var backButton = 0;
    $ionicPlatform.ready(function () {
        $ionicPlatform.registerBackButtonAction(function (e) {
            e.preventDefault();
            e.stopPropagation()
            if (backButton == 0) {
                backButton++;
                NativeBridge.toastshort("Press back again to exit");
                setTimeout(function () { backButton = 0; }, 5000);
            }
            else {
                if ($rootScope.channel)
                    $rootScope.channel.send(JSON.stringify({ type: "message", content: "Disconnected from game" }), $rootScope.target);
                navigator.app.exitApp();

            }
        }, 1000);
    })

}])
app.controller('discoverController', ['$scope', '$ionicModal', '$ionicLoading', '$rootScope', '$state', function ($scope, $ionicModal, $ionicLoading, $rootScope, $state) {
    require(['js/controllers/discoverController'], function (discover) {
        discover($scope, $ionicModal, $ionicLoading, $rootScope, $state)
    })
}])
app.controller('waitingController', ['$scope', '$ionicLoading', '$rootScope', '$state', '$ionicPlatform', '$window', function ($scope, $ionicLoading, $rootScope, $state, $ionicPlatform, $window) {
    require(['js/controllers/waitingController'], function (waiting) {
        waiting($scope, $ionicLoading, $rootScope, $state, $ionicPlatform, $window)
    })
}])
app.controller('winningController', ['$scope', '$ionicLoading', '$rootScope', '$state', function ($scope, $ionicLoading, $rootScope, $state) {
    require(['js/controllers/winningController'], function (winning) {
        winning($scope, $ionicLoading, $rootScope, $state)
    })
}])
app.controller('loserController', ['$scope', '$ionicLoading', '$rootScope', '$state', function ($scope, $ionicLoading, $rootScope, $state) {
    require(['js/controllers/loserController'], function (loser) {
        loser($scope, $ionicLoading, $rootScope, $state)
    })
}])
app.controller('mainController', ['$scope', '$ionicPopup', '$ionicBackdrop', '$ionicLoading', '$rootScope', '$ionicModal', '$ionicPlatform', '$window', function ($scope, $ionicPopup, $ionicBackdrop, $ionicLoading, $rootScope, $ionicModal, $ionicPlatform, $window) {
    require(['js/controllers/mainController'], function (main) {
        main($scope, $ionicPopup, $ionicBackdrop, $ionicLoading, $rootScope, $ionicModal, $ionicPlatform, $window)
    })
}])


document.addEventListener('deviceready', function () {
    onDeviceReady()
}, false);

function onDeviceReady() {
    deferred.resolve();
}