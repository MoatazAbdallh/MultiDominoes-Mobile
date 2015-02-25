define(function () {
    return function ($scope, $ionicModal, $ionicLoading, $rootScope,$state) {
        $scope.channelId = "com.espritsolutions.multidominoes";
        $rootScope.target = "host";
        var stringOnlyRegx = /^[A-Za-z0-9]+$/;
        $scope.gameSettings = {};
        $scope.loc = $('html').injector().get("$location");
        $rootScope.connectionMsgs = [];
        $scope.showLoading = function (msg) {
            $ionicLoading.show({
                template: '<img src="img/loading-large.gif" /><br/><h1>'+msg+'...</h1>'
            });
        }
        $scope.showNormalLoading = function () {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-a"></i> Connecting...'
            });
        }
        $scope.hideLoading = function () {
            $ionicLoading.hide();
        }
        $scope.onError = function (err) {
            $scope.hideLoading();
            NativeBridge.alert(err.message);
        }
        $scope.onConnect = function (channel) {

            $scope.modal.hide();
            $rootScope.channel = channel;

            // Wire up some event handlers
            $rootScope.channel.on("disconnect", function (myClient) {
                // app.updateConnectionStatus("disconnected");
                $rootScope.channel = null;
            });

            $rootScope.channel.on("clientConnect", function (client) {
                $state.go('waiting');
                // $scope.loc.path("/waiting");
            });

            $rootScope.channel.on("clientDisconnect", function () {
                //app.updateSendTargets();
            });

            $rootScope.channel.on("message", function (msg, client) {
                $scope.hideLoading();
                $scope.data = JSON.parse(msg);
                if ($scope.data.type == "connection" && $scope.data.flag == true) {
                    NativeBridge.toastshort($scope.data.message);
                    $rootScope.playersLength = $scope.data.playerslength;
                    if ($state.$current != 'waiting') //in case clientConnect event not fired
                        $state.go('waiting');
                }
                if ($scope.data.type == "readyToPlay" && $scope.data.flag == true) {
                    $scope.hideLoading();
                    $rootScope.startFlag = true;
                    $scope.$apply();
                }

                if ($scope.data.type == "cards") {
                    $rootScope.cards = $scope.data.cards;
                    $.each($rootScope.cards, function (i, card) {
                        card.show = true;
                    })
                    $state.go("main");
                }
                if ($scope.data.type == "message") {
                    NativeBridge.toastshort($scope.data.content);
                    if ($scope.data.content.indexOf("It's your Turn") > -1)
                        $rootScope.cardsDisabledFlag = false;
                    if ($scope.data.content.indexOf("Sorry we have reached max. number of players") > -1)
                        NativeBridge.closeApp();
                }

                if ($scope.data.type == "cardsuccessed") {
                    $rootScope.cardSuccessed = _.filter($rootScope.cards, function (card, id) {
                        return card.id == $scope.data.card.id
                    });
                    if ($scope.cardSuccessed) {
                        $rootScope.cardSuccessed[0].show = false;
                        $rootScope.cardsDisabledFlag = true;
                    }
                }
                if ($scope.data.type == "cardStatus") {
                    if ($scope.data.content == false)
                        $rootScope.cardsDisabledFlag = true; //we use rootscope as i want cardsdisabledFlag to be update main.html view
                }
                if ($scope.data.type == "drawCard") {
                    if ($scope.data.flag == true)
                        $rootScope.enableDrawButton = true; //we use rootscope as i want cardsdisabledFlag to be update main.html view
                }
            });

        }

        $scope.discover = function () {
            if ($scope.gameSettings.playerName && stringOnlyRegx.test($scope.gameSettings.playerName)){
            $scope.showLoading("Discovering");
            if (window.webapis.multiscreen.Device)
                window.webapis.multiscreen.Device.search($scope.onSuccessFindLocal, $scope.onError);
            }
            else
                NativeBridge.alert("Please enter your name", null, "Warning");
        }
        $scope.onSuccessFindLocal = function (devices) {
            $scope.hideLoading();
            if (devices.length > 0) {
                $scope.devices = devices; //This our devices Model
                $scope.modal.show();
            }
            else
                NativeBridge.alert("Sorry No Devices Found", null, "Warning");
            
        }
        $scope.selectDevice = function (device) {
            $scope.showNormalLoading();
            $scope.selectedDevice = device;
            $scope.selectedDevice.getApplication("MultiDominoes", $scope.onGetApplication, $scope.onError);
        }
        $scope.onGetApplication = function (application) {
            $scope.application = application;
            NativeBridge.toastshort($scope.channelId);
            NativeBridge.alert(JSON.stringify($scope.selectedDevice))
            if ($scope.application.lastKnownStatus !== "running") {
                $scope.application.launch({ "launcher": "Mobile-Dominoes" }, $scope.onLaunchSuccess,$scope.onError);
            } else {
                $scope.selectedDevice.connectToChannel($scope.channelId, { name: $scope.gameSettings.playerName }, function () { NativeBridge.alert("Success connection to channel")}, $scope.onError);
            }
        }
        $scope.onLaunchSuccess = function (application) {
            console.log("App Has Been Launched");
            $scope.selectedDevice.connectToChannel($scope.channelId, { name: $scope.gameSettings.playerName }, function () { NativeBridge.alert("Success connection to channel") }, $scope.onError);
        }
        
       
        $ionicModal.fromTemplateUrl('deviceList.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
    };
})