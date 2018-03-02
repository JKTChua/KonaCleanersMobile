function GiftCardsController($scope, dialogs, blockUI) {
    $scope.GiftCards = null;
    $scope.Customer = CustomerConnect.Config.Customer;

    $scope.LoadCards = function () {
        CustomerConnect.Customer.RetrieveGiftCards()
            .done(function (data) {
                $scope.$apply(function () {
                    $scope.GiftCards = angular.copy(data.ReturnObject);
                });
            });
    };

    $scope.AddCard = function () {
        var dlg = dialogs.create('Components/Dialogs/AddGiftCard.html', 'DialogController', $scope.data, { size: 'sm' });
        dlg.result.then(function (data) {
            if (typeof (data) != 'undefined') {
                CustomerConnect.Customer.RedeemGiftCard(data.Number)
                .done(function (data) {
                    dialogs.notify('Gift Card Reedemed', 'The gift card has been applied to your account.');
                    $scope.LoadCards();
                }).fail(function (data) {
                    dialogs.error('Error', 'Unable to add gift card to account.');
                });
            }
        });
    };

    $scope.LoadCards();
};