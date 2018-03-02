(function () {
    'use strict';

    angular
    .module('starter.controllers')
    .controller('LoginController', ['$rootScope','$scope','$state','$ionicPopup', 'localStorageService', 'userService','CustomerConnect', LoginController]);

    function LoginController($rootScope, $scope, $state, $ionicPopup, localStorageService, userService, CustomerConnect) {
        $scope.login = {
            emailAddress: "",
            password: ""
        };

        if (localStorageService.get('e') != null) {
            $scope.login.emailAddress = CustomerConnect.Util.base64._decode(localStorageService.get('e'));
            $scope.login.rememberEmail = true;
        }

        $scope.getCustomer = function () {
            CustomerConnect.Customer.GetCustomer()
            .then(function (data) {
                CustomerConnect.Config.Customer = data.ReturnObject;
                $rootScope.Customer = CustomerConnect.Config.Customer;
                $rootScope.LoggedIn = true;
                $state.go('app.ccdashboard');
            }, function (data) {
                $ionicPopup.alert({title: 'Load Failed', template: data.Message});
            });
        };

        $scope.loginUser = function () {
            CustomerConnect.StartSession().then(function () {
                CustomerConnect.User.Login($scope.login.emailAddress, $scope.login.password)
                .then(function (data) {

                    CustomerConnect.Config.Customer = data.ReturnObject;
                    CustomerConnect.Config.SessionId = data.ReturnObject.SessionID;

                    if (data.ReturnObject.PasswordComment != null) {
                        var dlg = $ionicPopup.alert({title: 'Password Change Required', template: data.ReturnObject.PasswordComment});
                        dlg.then(function () {
                            $scope.changePass.open();
                        });
                    }

                    localStorageService.set('token', data.ReturnObject.SessionID);
                    if ($scope.login.rememberEmail) {
                        localStorageService.set('e', CustomerConnect.Util.base64._encode($scope.login.emailAddress));
                    }
                    $scope.getCustomer();
                    $scope.LoadSettings();
                }, function (data) {
                    $ionicPopup.alert({title: 'Login Failed', template: data.Message});
                    $scope.startSession();
                });
            });
        };

        $scope.createAccount = function () {
            userService.setEmail($scope.login.emailAddress);
            userService.setPassword($scope.login.password);
            $state.go('app.signup');
        };

        $scope.sendPasswordEmail = function (templateData) {
            CustomerConnect.Customer.SendEmail({ ToAddress: $scope.login.emailAddress, Template: 7, Data: JSON.stringify(templateData) })
            .then(function () {
                $ionicPopup.alert({title: 'Email Sent', template: 'A password change email has been sent to your email address.'});
            }, function (emailData) {
                $ionicPopup.alert({title: 'Error Sending Email', template: emailData.Message});
            });
        };

        $scope.forgotPassword = function () {
            CustomerConnect.User.PasswordReminder({ emailAddress: $scope.login.emailAddress, ipAddress: '1.1.1.1' })
            .then(function (data) {
                var templateData = { IPAddress: data.ReturnObject.IPAddress, RememberKey: data.ReturnObject.RememberKey, FinishUrl: window.location.origin + window.location.pathname + '#/app/cc/reminder/' + data.ReturnObject.RememberKey };
                $scope.sendPasswordEmail(templateData);
            }, function (data) {
                $ionicPopup.alert({title: 'Password Reminder Error', template: data.Message});
            });
        };

        $scope.myIP = function () {
            // Need to convert to Angular, add IP address request to API
            if (window.XMLHttpRequest) var xmlhttp = new XMLHttpRequest();
            else var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

            xmlhttp.open("GET", "http://www.freegeoip.net/json/", false);
            xmlhttp.send();

            var hostipInfo = jQuery.parseJSON(xmlhttp.responseText);

            return hostipInfo['ip'];
        };
    };
})();