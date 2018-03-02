function PaymentsController($scope, dialogs, blockUI) {
    $scope.Customer = CustomerConnect.Config.Customer;

    $scope.filteredPayments = [];
    $scope.itemsPerPage = 5;
    $scope.currentPage = 1;

    $scope.numPages = function () {
        return Math.ceil($scope.AR.Payments.length / $scope.numPerPage);
    };

    $scope.figureOutPaymentsToDisplay = function () {
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = begin + $scope.itemsPerPage;
        $scope.filteredPayments = [];
        if ($scope.AR.Payments) {
            $scope.filteredPayments = $scope.AR.Payments.slice(begin, end);
        }
    };

    $scope.pageChanged = function () {
        $scope.figureOutPaymentsToDisplay();
    };

    $scope.init = function () {
        $scope.AR = { Balance: "0.00", Payments: [] };
        $scope.AR.Payment = { Amount: '0.00', CardInformation: null };

        CustomerConnect.AR.GetPaymentDetails()
            .done(function (data) {
                $scope.AR.Payments = data.ReturnObject;
                $scope.$apply(function () {
                    $scope.figureOutPaymentsToDisplay();
                });
            }).fail(function () {
                dialogs.error('Load Failed', 'Unable to load payments.');
            });

        CustomerConnect.AR.GetARBalance()
            .done(function (data) {
                $scope.AR.Balance = data.ReturnObject.ARBalance;
            }).fail(function () {
                $scope.AR.Balance = 'Error';
                dialogs.error('Load Failed', 'Unable to retrieve balance.');
            });
    };

    $scope.init();
    

    $scope.CCValid = false;

    $scope.ValidateCard = function () {
        $scope.CCValid = CustomerConnect.Util.Validate.CCNumber($scope.AR.Payment.CardInformation.CardInfo);
        console.log(CustomerConnect.Util.Validate.CCNumber($scope.AR.Payment.CardInformation.CardInfo));
    };

    $scope.submitPayment = function () {
        var cc = $scope.AR.Payment.CardInformation;
        console.log('payment');


        CustomerConnect.AR.SavePayment(cc.CardId, cc.CardInfo, cc.CardExpiration, cc.SaveCard, $scope.AR.Payment.Amount + '')
            .done(function (data) {
                dialogs.notify('Payment submitted', 'Your payment has been submitted and will reflect on your account in up to 24 hours.');
                $scope.AR.Payment = null;
            }).fail(function (data) {
                dialogs.error('Payment failed.', data.Message);
            });
    };
};