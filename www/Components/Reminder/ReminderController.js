(function () {
    'use strict';

    angular
    .module('starter.controllers')
    .controller('ReminderController', ['$scope', '$ionicPopup', '$stateParams', '$state', 'CustomerConnect', ReminderController]);

    function ReminderController($scope, $ionicPopup, $stateParams, $state, CustomerConnect) {
        $scope.Request = { RememberKey: $stateParams.key, ZipCode: '', NewPassword: '' };

        $scope.ChangePassword = function (data) {
            $scope.Request.NewPassword = data;
            CustomerConnect.User.FinishPasswordReminder($scope.Request)
            .then(function (data) {
                $ionicPopup.alert({title:'Password Changed', template:'Your password has been changed.'});
                $state.go('app.login');
            }, function (data) {
                 $ionicPopup.alert({title:'Password Change Error', template:data.Message});
            });
        };
    };
})();