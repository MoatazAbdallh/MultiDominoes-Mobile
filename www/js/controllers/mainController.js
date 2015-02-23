define(function () {
    return function ($scope, $ionicPopup, $ionicBackdrop, $ionicLoading, $rootScope) {
        $scope.detectCard = function (card) {
            return "img/cards/" + card.r + card.l + ".png";
        }
        $scope.sendCard = function (card, side) {
            if (!$rootScope.cardsDisabledFlag) //in case the player has the turn to play
            $rootScope.channel.send(JSON.stringify({ type: "playedcard", card: card,side:side }), $rootScope.target);
        }
        $scope.cardSwipedLeft = function (card) {
            console.log("Card Id: " + card.id + " Has been swipped left");
            $scope.sendCard(card, 'head');
        }
        $scope.cardSwipedRight = function (card) {
            console.log("Card Id: " + card.id + " Has been swipped right");
            $scope.sendCard(card, 'tail');

        }
        $scope.cardPartialSwipe = function (card) {
            console.log("card has been partial swipped");
        }
    }
})