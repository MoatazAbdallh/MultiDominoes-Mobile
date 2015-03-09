'use strict';

var deferred = $.Deferred();

// Declare app level module which depends on views, and components
var app = angular.module('Dominoes', ['ionic', 'rgCacheView', 'ionic.contrib.ui.tinderCards'
]).config(function ($stateProvider, $urlRouterProvider) {

    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/discover")

    $stateProvider
      .state('discover', {
          url: "/discover",
          templateUrl: "views/discover.html",
          controller: 'discoverController',
          resolve:{
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
app.run(['$ionicBackdrop','$rootScope',function ($ionicBackdrop,$rootScope) {
    $rootScope.backDrop = $ionicBackdrop;
}])
app.controller('discoverController', ['$scope', '$ionicModal', '$ionicLoading', '$rootScope', '$state', function ($scope, $ionicModal, $ionicLoading, $rootScope, $state) {
    require(['js/controllers/discoverController'], function (discover) {
        discover($scope, $ionicModal, $ionicLoading, $rootScope, $state)
    })
}])
app.controller('waitingController', ['$scope', '$ionicLoading', '$rootScope', '$state', function ($scope, $ionicLoading, $rootScope, $state) {
    require(['js/controllers/waitingController'], function (waiting) {
        waiting($scope, $ionicLoading, $rootScope, $state)
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
app.controller('mainController', ['$scope', '$ionicPopup', '$ionicBackdrop', '$ionicLoading', '$rootScope', '$ionicModal', function ($scope, $ionicPopup, $ionicBackdrop, $ionicLoading, $rootScope, $ionicModal) {
    require(['js/controllers/mainController'], function (main) {
        main($scope, $ionicPopup, $ionicBackdrop, $ionicLoading, $rootScope, $ionicModal)
    })
}])
app.filter('removeUrl', function () {
    return function (input) {
        if (!input) return input;
        var wwwRegex = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        return input.replace(wwwRegex, '');
    }
});
app.filter('formateTime', function () {
    return function (input) {
        if (!input) return input;
        var time = new Date(input).toLocaleString();
        time = moment(time).format('MMMM Do YYYY, h:mm ');
        return time;
    }
});
app.filter('arabic', ['$sanitize', '$sce','$parse', function($sanitize,$sce,$parse) {
    var arabicRegex = /[\u0600-\u06FF]/;
    var html = [];
    return function (input) {
        if (!input) return input;
        input = $parse(input);
        debugger
        if (arabicRegex.test(input)) {
            html.push("<p style='direction:rtl'>");
            html.push(input);
            html.push("</p>");
            return $sanitize(html.join(''));
        }
        else
            return input;
    }
}]);

app.directive('errsrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errsrc) {
                    attrs.$set('src', attrs.errsrc);
                }
            });
        }
    }
});

document.addEventListener('deviceready', function () { onDeviceReady() }, false);

function onDeviceReady() {
    deferred.resolve();
}