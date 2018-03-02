(function () {
    'use strict';

    angular
    .module('starter.controllers')
    .controller('DialogController', ['$scope', '$ionicModal', DialogController]);

    function DialogController($scope, $ionicModal) {
        $ionicModal.fromTemplateUrl($scope.template, {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.open = function () {
            $scope.modal.show();
        }; // end open

        $scope.done = function (data) {
            $scope.returnModal(data);
            $scope.modal.hide();
        }; // end done

        $scope.cancel = function () {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.print = function () {
            var printContents = document.getElementsByClassName('modal-body')[0].innerHTML;
            if (printContents != null) {
                var popupWin = window.open('', '_blank', '');
                popupWin.document.open()
                popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print(); window.close();">' + printContents + '</html>');
                popupWin.document.close();
            }
        };

        $scope.email = function () {

        };
    }
})();