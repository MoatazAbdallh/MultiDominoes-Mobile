define(function () {
    return function ($scope, $ionicModal, $ionicLoading, $rootScope, $state) {
        $scope.channelId = "com.espritsolutions.multidominoes";
        $rootScope.target = "host";
        var stringOnlyRegx = /^[A-Za-z0-9]+$/;
        $scope.gameSettings = {};
        $scope.gameSettings.uuid = NativeBridge.guid();
        $scope.loc = $('html').injector().get("$location");
        $rootScope.connectionMsgs = [];
        $('.backdrop').css('visibility', 'hidden');
        cordova.plugins.Keyboard.disableScroll(true);

        $scope.showLoading = function (msg) {
            $ionicLoading.show({
                template: '<img src="img/loading-large.gif" /><br/><h1>' + msg + '...</h1>'
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
            if (err.message.indexOf("CORS") > -1)
                NativeBridge.alert("Please Check your network connection", null, "Warning");
            else
                NativeBridge.alert(err.message);
        }


        $scope.discover = function (myForm) {
            if (myForm.$valid) {
                if (window.cordova && cordova.plugins.Keyboard)
                    cordova.plugins.Keyboard.close();
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
            //console.log(device)
            $scope.showNormalLoading();
            $scope.selectedDevice = device;
            $scope.selectedDevice.getApplication("MultiDominoes", $scope.onGetApplication, $scope.onError);
        }
        $scope.onGetApplication = function (application) {
            //console.log(application)
            $scope.application = application;
            if ($scope.application.lastKnownStatus !== "running") {
                $scope.application.launch({ "launcher": "Mobile-Dominoes" }, $scope.onLaunchSuccess, $scope.onError);
            } else {
                //console.log($scope.selectedDevice)
                $scope.selectedDevice.connectToChannel($scope.channelId, { name: $scope.gameSettings.playerName, uuid: $scope.gameSettings.uuid }, $scope.onConnect, $scope.onError);
            }
        }
        $scope.onLaunchSuccess = function (application) {
            console.log("App Has Been Launched");
            setTimeout(function () {
                $scope.selectedDevice.connectToChannel($scope.channelId, { name: $scope.gameSettings.playerName, uuid: $scope.gameSettings.uuid }, $scope.onConnect, $scope.onError);
            }, 5000)
        }
        $scope.onConnect = function (channel) {

            $scope.modal.hide();
            $rootScope.channel = channel;

            // Wire up some event handlers
            $rootScope.channel.on("disconnect", function (myClient) {
                $rootScope.channel = null;
                NativeBridge.toastshort("Disconnected from channel, please discover again");
                //$rootScope.channel.send(JSON.stringify({ type: "message", content: "Disconnected from game" }), $rootScope.target);
                //$rootScope.startFlag = false;
                $scope.hideLoading();
                if ($rootScope.modal2)
                    $rootScope.modal2.hide();
                $scope.modal.hide();
                $state.go('discover');
            });

            $rootScope.channel.on("clientConnect", function (client) {
                if (client.attributes.uuid == $scope.gameSettings.uuid)
                    $state.go('waiting');
            });

            $rootScope.channel.on("clientDisconnect", function (client) {
                console.log(client.attributes.name + " has been disconnected");
            });

            $rootScope.channel.on("message", function (msg, tvSide) {
                $scope.hideLoading();
                $scope.data = JSON.parse(msg);
                if ($scope.data.type == "connection" && $scope.data.flag == true) {
                    NativeBridge.toastshort($scope.data.message);
                    $rootScope.playersLength = $scope.data.playerslength;
                    if ($state.$current != 'waiting') //in case clientConnect event not fired
                        if ($scope.data.uuid == $scope.gameSettings.uuid)
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
                    if ($scope.data.content.indexOf("has been disconnected") > -1) {
                        $scope.hideLoading();
                        if ($rootScope.modal2)
                            $rootScope.modal2.hide();
                        $scope.modal.hide();
                        $state.go('discover');

                    }
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
                if ($scope.data.type == "cardFailed") {
                    $rootScope.cardFailed = _.filter($rootScope.cards, function (card, id) {
                        return card.id == $scope.data.card.id
                    });
                    if ($scope.cardFailed) {
                        $rootScope.cardsDisabledFlag = false; //enable UI for Players Interaction
                        $rootScope.cardFailed[0].show = true;
                    }
                    NativeBridge.toastshort($scope.data.content);
                }
                if ($scope.data.type == "cardStatus") {
                    if ($scope.data.content == false)
                        $rootScope.cardsDisabledFlag = true; //we use rootscope as i want cardsdisabledFlag to be update main.html view
                    $('.backdrop').css('visibility', 'visible');
                }
                if ($scope.data.type == "drawCard") {
                    if ($scope.data.flag == true)
                        $rootScope.enableDrawButton = true; //we use rootscope as i want cardsdisabledFlag to be update main.html view
                    else
                        $rootScope.enableDrawButton = false;
                }
                if ($scope.data.type == "passTurn") {
                    if ($scope.data.flag == true) {
                        $rootScope.cardsDisabledFlag = false; //enable UI for player interaction
                        $rootScope.enablePassButton = true;
                        $rootScope.enableDrawButton = false;
                    }
                    else {
                        $rootScope.cardsDisabledFlag = true; //enable UI for player interaction
                        $rootScope.enablePassButton = false;

                    }
                }

                if ($scope.data.type == "drawedCard") {
                    $scope.newCard = $scope.data.card;
                    $scope.newCard.show = true;
                    $rootScope.cardsDisabledFlag = false; //enable UI for player interaction
                    $rootScope.cards.push($scope.newCard);
                }
                if ($scope.data.type == "winner" && $scope.data.flag == true) {
                    $state.go("winning")
                }
                if ($scope.data.type == "winner" && $scope.data.flag == false) {
                    $state.go("loser")
                }
            });

        }

        $ionicModal.fromTemplateUrl('deviceList.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
    };
})