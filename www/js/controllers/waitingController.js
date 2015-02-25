define(function () {
    return function ($scope, $ionicLoading, $rootScope,$state) {
        $scope.showLoading = function (msg) {
            $ionicLoading.show({
                template: '<img src="img/loading-large.gif" /><br/><h1>Waiting For Players</h1>'
            });
        }
        $scope.hideLoading = function () {
            $ionicLoading.hide();
        }
        if($rootScope.playersLength<=1)
            $scope.showLoading();

        $scope.start = function () {
            $rootScope.channel.send(JSON.stringify({ type: "startPlay", flag:true}), $rootScope.target);
        }
    }
})