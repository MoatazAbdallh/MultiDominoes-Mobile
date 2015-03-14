define(function () {
    return function ($scope, $ionicPopup, $ionicBackdrop, $ionicLoading, $rootScope, $ionicModal) {
        $ionicModal.fromTemplateUrl('views/swipe.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.showLeftImage = true;
            $scope.showRightImage = true;
            $scope.swipeCount = 0;
            $scope.modal.show();

        });
        $scope.showNormalLoading = function () {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-a"></i> Connecting...'
            });
        }
        $scope.imageSwipedLeft = function (imgType) {
            if (imgType == 'left')
                $scope.showLeftImage = false
            else
                NativeBridge.toastshort("Swipe in the other direction");
        }
        $scope.imageSwipedRight = function (imgType) {
            if (imgType == 'right')
                $scope.showRightImage = false
            else
                NativeBridge.toastshort("Swipe in the other direction");
        }
        $scope.getScreenWidth = function () {
            console.log("Screen Width "+ window.innerWidth)
            return window.innerWidth;
        }
        $scope.detectCard = function (card) {
            return "img/cards/" + card.r + card.l + ".png";
        }
        $scope.sendCard = function (card, side) {
            if (!$rootScope.cardsDisabledFlag) { //in case the player has the turn to play
                $rootScope.cardsDisabledFlag = true;
                $rootScope.channel.send(JSON.stringify({ type: "playedcard", card: card, side: side }), $rootScope.target);
            }
        }
        $scope.cardSwipedLeft = function (card) {
            //console.log("Card Id: " + card.id + " Has been swipped left");
            card.show = false; //hide the card untill you recieve response from TV
            //$rootScope.cardsDisabledFlag = true; //disable UI until you get response from TV
            $scope.sendCard(card, 'head');
        }
        $scope.cardSwipedRight = function (card) {
            //console.log("Card Id: " + card.id + " Has been swipped right");
            card.show = false; //hide the card untill you recieve response from TV
           // $rootScope.cardsDisabledFlag = true; //disable UI until you get response from TV
            $scope.sendCard(card, 'tail');

        }
        $scope.cardPartialSwipe = function (card) {
            console.log("card has been partial swipped");
        }
        $scope.cardStyling = function () {
            console.log("Editing Margining")
            var style={};
            if ($scope.enablePassButton || $scope.enableDrawButton)
                style['margin-top'] = '5%';
            else
                style['margin-top'] = '10%';
            return style;
        }
        $scope.$watch('cardsDisabledFlag', function (newValue, oldValue) {
            if (newValue == true){
                $('.backdrop').css('visibility','visible')
            }
            else{
                $('.backdrop').css('visibility', 'hidden')
            }

        });
        $scope.$watch('showLeftImage', function (newValues, oldValues) {
            if (newValues==false && !$scope.showRightImage)
                $scope.modal.hide();
        });
        $scope.$watch('showRightImage', function (newValues, oldValues) {
            if (newValues==false && !$scope.showLeftImage)
                $scope.modal.hide();
        });
        $scope.drawCard = function () {
            $rootScope.cardsDisabledFlag = true; //disable UI until you get response from TV
            $rootScope.channel.send(JSON.stringify({ type: "yDrawCard" }), $rootScope.target);
        }
        $scope.passTurn = function () {
            $rootScope.cardsDisabledFlag = true; //disable UI until you get response from TV
            $rootScope.channel.send(JSON.stringify({ type: "yPassTurn" }), $rootScope.target);

        }
    }
})