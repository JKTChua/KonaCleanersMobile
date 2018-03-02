(function () {
    'use strict';

    angular
    .module('starter.controllers')
    .controller('SignupController', ['$scope','$state','userService','$stateParams', '$rootScope', '$ionicPopup','vcRecaptchaService', 'CustomerConnect', SignupController]);

    function SignupController($scope, $state, userService, $stateParams, $rootScope, $ionicPopup, vcRecaptchaService, CustomerConnect) {
        $scope.Customer = { Type: "DELIVERY", EmailAddress: userService.getEmail(), PhoneType: 'Choose Type', ReferringCustomerKey: $stateParams.key, CaptchaValid: userService.getCaptchaValid(), Settings: $rootScope.Settings };
        $scope.SessionHTTPRequest.then(function () {
            $scope.Customer.Settings = CustomerConnect.Config.Settings;
            $scope.Settings = CustomerConnect.Config.Settings;

            $scope.Stores = CustomerConnect.Config.Settings.Stores;
            $scope.Customer.Store = $scope.Stores[0];
        });

        $scope.pickDelivery = function () {
            $scope.Customer.Type = 'DELIVERY';
            $scope.Customer.Store = $scope.Stores[9]; //Delivery store
        };

        $scope.finishedWizard = function () {
            if (userService.getCaptchaValid() || $scope.Settings.General['Enable Captcha'] == 0) {
                $scope.SaveCustomer();
            } else {
                if (vcRecaptchaService.getResponse($scope.CaptchaID) === "") {
                    $ionicPopup.alert({title:'Captcha Error', template: 'Please resolve the captcha before sending.'});
                } else {
                    $scope.Settings.ValidateCaptcha(vcRecaptchaService.getResponse())
                        .then(function (cdata) {
                            if (!cdata.Failed) {
                                userService.setCaptchaValid(true);
                                $scope.SaveCustomer();
                            }
                        }, function (cdata) {
                            $ionicPopup.alert({title:'Captcha Error', template: 'Unable to validate captcha. Please refresh your browser.'})
                        });
                }
            }
        };

        $scope.addressValid = function () {
            return false;
        };

        $scope.storePass = function (pass) {
            $scope.Customer.Password = pass;
        }

        $scope.SaveCustomer = function () {
            var ci = {
                accountNodeID: $scope.Customer.Store.StoreID,
                clientAccountID: '',
                firstName: $scope.Customer.FirstName,
                lastName: $scope.Customer.LastName,
                name: $scope.Customer.LastName + ', ' + $scope.Customer.FirstName,
                emailAddress: $scope.Customer.Email,
                serviceType: $scope.Customer.Type,
                password: $scope.Customer.Password,
                phones: [{ number: $scope.Customer.PhoneNumber, phoneType: $scope.Customer.PhoneType, phoneMask: $scope.Settings.General['Phone Mask'] }],
                primaryAddress: { Address1: $scope.Customer.Address1, Address2: $scope.Customer.Address2, City: $scope.Customer.City, State: $scope.Customer.State, Zip: $scope.Customer.Zip },
                referringCustomerKey: $scope.Customer.ReferringCustomerKey
            };

            if($scope.Customer.CC && $scope.Customer.Type == 'DELIVERY')
                ci.creditCardsToSave = [$scope.Customer.CC];

            CustomerConnect.Customer.SaveCustomer(ci)
            .then(function (data) {
                $ionicPopup.alert({title:'Signup submitted', template: $scope.Settings.Signup['Submitted Message']});
                $state.go('app.login');
            }, function (data) {
                $ionicPopup.alert({title:'Signup failed.', template: data.Message});
            });
        };

        $scope.setWidgetId = function (widgetId) {
            $scope.CaptchaID = widgetId;
        };
    };
})();