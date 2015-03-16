define(function () {
    return function ($scope, $ionicLoading, $rootScope,$state) {
        $scope.showLoading = function (msg) {
            $ionicLoading.show({
                template: '<img src="img/loading-large.gif" /><br/><h1>Continue Game</h1>'
            });
        }
        $scope.hideLoading = function () {
            $ionicLoading.hide();
        }
        $('.backdrop').css('visibility', 'hidden');
        $scope.continue = function () {
            $rootScope.channel.send(JSON.stringify({ type: "continuePlay", flag:true}), $rootScope.target);
        }
        $scope.exit = function () {
            $rootScope.channel.send(JSON.stringify({ type: "exitPlay", flag: true }), $rootScope.target);
        }
    }
})