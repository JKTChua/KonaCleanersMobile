(function () {
    'use strict';

    angular
    .module('starter.controllers')
    .controller('SendMessageController', ['$rootScope','$scope','$ionicModal','$ionicPopup', 'vcRecaptchaService', 'userService','CustomerConnect', SendMessageController]);

    function SendMessageController($rootScope, $scope, $ionicModal, $ionicPopup, vcRecaptchaService, userService, CustomerConnect) {
        // Form data for the login modal
        $scope.data = {};

        // Create the message modal that we will use later
        $ionicModal.fromTemplateUrl('Components/Dialogs/SendMessage.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the message modal to close
        $scope.cancel = function() {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        // Perform the send message action when the user submits the message form
        $scope.submitMessage = function() {
            if (typeof ($scope.data) != 'undefined') {
                if ($scope.data.name != null) {
                    $scope.data.messageBody = $scope.data.name + '\n' + $scope.data.emailAddress + '\n\n' + $scope.data.messageBody;
                }
                $scope.sendMessage($scope.data);
            }
        };

        // Open the message modal
        $scope.open = function (invoiceId, invoiceKey) {
            $scope.data = { LoggedIn: $rootScope.LoggedIn, InvoiceId: invoiceId, InvoiceKey: invoiceKey, Settings: $rootScope.Settings, CaptchaValid: userService.getCaptchaValid()};

            if (typeof (invoiceId) == 'undefined') {
                $scope.data.InvoiceId = null;
            }

            $scope.modal.show();
        };

        $scope.sendMessage = function (data) {
            console.log([data.subject, data.messageBody, $scope.data.InvoiceId]);
            CustomerConnect.User.SendMessage(data.subject, data.messageBody, $scope.data.InvoiceId)
                .then(function (data) {
                    $ionicPopup.alert({title: 'Message Sent', template: 'Your message has been sent successfully.'});
                    $scope.modal.hide();
                }, function (data) {
                    $ionicPopup.alert({title: 'Sending Error', template: 'Your message was not able to be sent. Please try again.'});
                });
        };

        $scope.setWidgetId = function (widgetId) {
            $scope.CaptchaID = widgetId;
        };
    };
})();