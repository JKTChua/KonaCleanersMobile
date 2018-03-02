(function () {
    'use strict';

    angular
    .module('starter.controllers')
    .controller('ReferralController', ['$scope', '$cordovaSocialSharing', 'CustomerConnect', ReferralController]);

    function ReferralController($scope, $cordovaSocialSharing, CustomerConnect) {
        // Init
        $scope.Customer = CustomerConnect.Config.Customer;
        $scope.customerKey = $scope.Customer.CustomerKey;
        $scope.customerKeyBarcode = $scope.Customer.CustomerKeyBarcode;

        $scope.ShareAll = function () {
            $cordovaSocialSharing
            .share("Click to sign up for Kona Cleaners and earn $10 free!",
            "Earn $10 when you sign up",
            'http://becreative360.net/CustomerConnect/barcode/referralcodeimg.php?facebook=1&code='+$scope.customerKey,
            'http://becreative360.net/?'+$scope.customerKey) // Share via native share sheet
            .then(function(result) {
              // Success!
            }, function(err) {
              // An error occured. Show a message to the user
            });
        };
    };
})();