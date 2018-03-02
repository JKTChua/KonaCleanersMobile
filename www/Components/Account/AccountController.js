(function () {
    'use strict';

    angular
    .module('starter.controllers')
    .controller('AccountController', ['$scope','$rootScope','$filter','$ionicPopup', '$controller', '$state', 'CustomerConnect', AccountController]);

    function AccountController($scope, $rootScope, $filter, $ionicPopup, $controller, $state, CustomerConnect) {
        // Set data manip
        $scope.initCustomer = initCustomer;
        $scope.setBirthDays = setBirthDays;

        $scope.SessionHTTPRequest.then(function () {
            $scope.Customer = angular.copy($rootScope.Customer);
            $scope.Customer.Notifications = $filter('orderBy')($scope.Customer.Notifications, 'NotificationTypeDescription', false);
            $scope.Settings.Notifications = $filter('orderBy')($scope.Settings.Notifications, ['Description', 'MethodName'], false);
            $scope.Settings = $rootScope.Settings;

            if($scope.Settings.General['Customer Referral']['Enable Customer Referral'] == 1 && $scope.Customer.ShowReferral) {
                $scope.referral = $scope.$new();
                $scope.referral.template = 'Components/Dialogs/CustomerReferral.html';
                $controller('DialogController', {$scope: $scope.referral});
            }

            // Initialize Customer
            $scope.initCustomer();
        });

        $scope.$watch('birthMonth', function () {
            $scope.setBirthDays();
        });

        function setBirthDays() {
            $scope.birthDays = [];

            for (var x = 1; x <= getNumberOfDays(2012, $scope.birthMonth - 1) ; x++) {
                $scope.birthDays.push(x);
            }
        };

        function getNumberOfDays(year, month) {
            var isLeap = ((year % 4) == 0 && ((year % 100) != 0 || (year % 400) == 0));
            return [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        };

        function initCustomer() {
            if (CustomerConnect.Config.Customer.Birthdate == '0001-01-01T00:00:00') {
                $scope.Customer.Birthdate = '';
            } else {
                $scope.birthMonth = moment($scope.Customer.Birthdate).month()+1;
                $scope.setBirthDays();
                $scope.birthDate = moment($scope.Customer.Birthdate).date();
            }
        };

        // Save Records
        $scope.SaveAccount = function () {
            var ci = CustomerConnect.Config.Customer;
            if ($scope.birthMonth) {
                $scope.Customer.Birthdate = new Date(2012, $scope.birthMonth - 1, $scope.birthDate);
            }

            if ($scope.Customer.CreditCards.length > 0) {
                if ($scope.Customer.CreditCards[0].CardInfo != CustomerConnect.Config.Customer.CreditCards[0].CardInfo || $scope.Customer.CreditCards[0].CardExpiration != CustomerConnect.Config.Customer.CreditCards[0].CardExpiration) {
                    $scope.Customer.creditCardsToSave = [{ number: $scope.Customer.CreditCards[0].CardInfo, type: CustomerConnect.Util.Validate.GetCCType($scope.Customer.CreditCards[0].CardInfo), expiration: $scope.Customer.CreditCards[0].CardExpiration }];
                }
            } else {
                // $scope.Customer.creditCardsToSave = [{ number: $scope.Customer.CreditCards[0].CardInfo, type: CustomerConnect.Util.Validate.GetCCType($scope.Customer.CreditCards[0].CardInfo), expiration: $scope.Customer.CreditCards[0].CardExpiration }];
            }

            ci = $scope.Customer;
            console.log(ci);

            CustomerConnect.Customer.SaveCustomer(ci)
            .then(function () {
                $ionicPopup.alert({title: 'Update submitted', template: $scope.Settings['Account Update']['Submitted Message']});
                $scope.accountForm.$setPristine();

                CustomerConnect.Customer.GetCustomer().then(function (data) {
                    CustomerConnect.Config.Customer = data.ReturnObject;
                    $rootScope.Customer = CustomerConnect.Config.Customer;
                });
            }, function(data) {
                $ionicPopup.alert({title: 'Update failed.', template: data.Message});
            });
        };

        // Undo Form
        $scope.UndoChanges = function () {
            $scope.Customer = angular.copy(CustomerConnect.Config.Customer);
            $scope.initCustomer();
            $scope.setCustomerNotificationOptions();
        };

        // Date Control
        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.dateFormat = 'MM-dd-yyyy';

        // Additional Phones
        $scope.AddPhone = function () {
            if ($scope.Customer.Phones.length < 5) {
                $scope.Customer.Phones.push({ Extension: "", Number: "", PhoneMask: "(###) ###-####", PhoneType: "Choose Type" });
            }
        };

        $scope.RemovePhone = function ($index) {
            $scope.Customer.Phones.splice($index, 1);
        };

        $scope.customerReferral = function () {
            for (var x = 0; x < $scope.Settings.Stores.length; x++) {
                if ($scope.Settings.Stores[x].StoreID == $scope.Customer.AccountNodeID) {
                    $scope.Store = $scope.Settings.Stores[x];
                }
            }

            $scope.referral.data = { Customer: $scope.Customer, Settings: $scope.Settings, Store: $scope.Store };
            $scope.referral.open();
        };

        // Notifications
        $scope.changeNotification = function (notification) {
            var nf = { NotificationMethodName: notification.selectedMethod.name, NotificationMethodDescription: notification.selectedMethod.description, NotificationTypeName: notification.name, NotificationTypeDescription: notification.description, NotificationValue: false };

            $scope.updateNotifications($scope.Customer.Notifications, nf);

            $scope.Customer.Notifications = $filter('orderBy')($scope.Customer.Notifications, 'NotificationTypeDescription', false);
        };

        $scope.updateNotifications = function (arr, nf) {
            for (var x = 0; x < arr.length; x++) {
                if (arr[x].NotificationTypeName == nf.NotificationTypeName) {
                    console.log(arr);
                    arr[x] = nf;

                    return true;
                }
            }

            arr.push(nf);
            return true;
        };

        $scope.RemoveNotification = function ($index) {
            $scope.Customer.Notifications.splice($index, 1);
        };

        $scope.updatePreferences = function (arr, pref) {
            for (var x = 0; x < arr.length; x++) {
                if (arr[x].Name == pref.Name) {
                    arr[x] = pref;

                    return true;
                }
            }

            arr.push(pref);
            return true;
        }

        // Preferences
        $scope.changePreference = function () {
            var pref = { Name: $scope.Preferences.Name, Value: $scope.Preferences.Value, Description: $scope.Preferences.Description };

            $scope.updatePreferences($scope.Customer.Preferences, pref);

            $scope.Preferences = [];
        }
    };
})();