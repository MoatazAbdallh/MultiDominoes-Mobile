define(function () {
    return function ($scope, $ionicLoading, $rootScope,$state) {
        $scope.showLoading = function (msg) {
            $ionicLoading.show({
                template: '<img src="img/loading-large.gif" /><br/><h1>Waiting Continue Game</h1>'
            });
        }
        $scope.hideLoading = function () {
            $ionicLoading.hide();
        }

        $scope.showLoading();
    }
})