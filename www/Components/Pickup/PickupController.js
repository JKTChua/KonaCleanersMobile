(function () {
    'use strict';

    angular
    .module('starter.controllers')
    .controller('PickupController', ['$rootScope', '$scope', '$ionicPopup', '$ionicModal', 'CustomerConnect', 'ionicDatePicker', PickupController]);

    function PickupController($rootScope, $scope, $ionicPopup, $ionicModal, CustomerConnect, ionicDatePicker) {
        $scope.dateFormat = 'MM-dd-yyyy';
        $scope.minDate = Date.now();
        $scope.initDate = Date.now();
        $scope.maxDate = moment().add(3, 'months');

        var d = new Date();
        d.setHours(8);
        d.setMinutes(0);
        d.setSeconds(0);

        $scope.Pickup = { Comments: '', Instructions: '', Date: d, DeliveryDate: moment(d).add(1, 'days').format(), Visit: 'Pickup' };

        var datePickerOptions = {
            from: $scope.minDate,
            inputDate: $scope.Pickup.Date,
            disableWeekdays: [],
            closeOnSelect: false,
            templateType: 'popup'
        };

        // Date Control
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        var disableDays = $scope.SessionHTTPRequest.then(function () {
            $scope.Customer = CustomerConnect.Config.Customer;
            $scope.Settings = CustomerConnect.Config.Settings;
            console.log($scope.Customer);

            if ($scope.Settings.Pickup["Allow Delivery Date Selection"] == '1') {
                $scope.Pickup.Visit = 'Both Pickup and Delivery';
            }

            datePickerOptions.callback = (function (val) {
                if($scope.openedPickup)
                    $scope.Pickup.Date = new Date(val);
                else
                    $scope.Pickup.DeliveryDate = new Date(val);
            });

            for(var x = 0; x < 7; x++)
                if($scope.inValidDay(x))
                    datePickerOptions.disableWeekdays.push(x);
        });

        $scope.inValidDay = function (index) {
            if (index == 0) {
                index = 7;
            }
            if($scope.Customer !== undefined)
                return ($scope.Customer.RouteDays.charAt(index-1) == '-');
        };

        $scope.disabled = function (date, mode) {
            if(date !== undefined)
                return (mode === 'day' && $scope.inValidDay(date.getDay()));
        };

        $scope.open = function ($event, pickup) {
            $event.preventDefault();
            $event.stopPropagation();

            disableDays.then(function() {
                ionicDatePicker.openDatePicker(datePickerOptions);
            });

            if (pickup) {
                $scope.openedPickup = true;
                $scope.openedDelivery = false;
            } else {
                $scope.openedDelivery = true;
                $scope.openedPickup = false;
            }
        };

        $scope.schedulePickup = function () {
            console.log($scope.Pickup);

            if ($scope.Settings.Pickup['Allow Delivery Date Selection'] == '1') {
                $scope.Pickup.DeliveryDate = moment($scope.Pickup.DeliveryDate).format();
            } else {
                $scope.Pickup.DeliveryDate = null;
            }

            CustomerConnect.Route.SavePickupRequest({ pickupDate: moment($scope.Pickup.Date).format(), deliveryDate: $scope.Pickup.DeliveryDate, comments: $scope.Pickup.Comments, instructionsRequests: $scope.Pickup.Instructions, visitType: $scope.Pickup.Visit })
                .then(function (data) {
                    $ionicPopup.alert({title: 'Success', template: 'Your pickup has been scheduled for ' + moment($scope.Pickup.Date).format('MM-DD-YYYY') + '.'});
                    $scope.pickupForm.$setPristine();
                    $scope.Pickup = { Date: null, Comments: '', Instructions: '' };
                }, function (data) {
                    $ionicPopup.alert({title: 'Error', template: 'Your pickup was not able to be scheduled. Please try again.'});
                });
        };

        $scope.pendingPickups = function () {
            CustomerConnect.Route.PendingPickups()
            .then(function (data) {
                $scope.Pickups = { PendingPickups: data.ReturnObject };

                $scope.filteredPickups = [];
                $scope.itemsPerPage = 5;
                $scope.currentPage = 1;

                $scope.figureOutPickupsToDisplay();
                $scope.modal.show();
            }, function (data) {
                $ionicPopup.alert({title: 'Error', template: 'Unable to display pending pickups.'});
            });
        };

        $ionicModal.fromTemplateUrl('Components/Dialogs/Pickups.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.timeChange = function () {
            console.log($scope.Pickup.Date.getHours());
            if ($scope.Pickup.Date.getHours() > 15) {
                var maxDate = $scope.Pickup.Date;
                maxDate.setHours(15);
                maxDate.setMinutes(0);

                $scope.Pickup.Date = maxDate;
            }
        };

        //PickupsController
        $scope.numPages = function () {
            return Math.ceil($scope.Pickups.PendingPickups.length / $scope.numPerPage);
        };

        $scope.figureOutPickupsToDisplay = function () {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;

            $scope.filteredPickups = [];

            if ($scope.Pickups.PendingPickups != null) {
                if ($scope.Pickups.PendingPickups.length > 0) {
                    $scope.filteredPickups = $scope.Pickups.PendingPickups.slice(begin, end);
                }
            }
        };

        $scope.pageChanged = function () {
            $scope.figureOutPickupsToDisplay();
        };

        $scope.done = function () {
            $scope.modal.hide();
        }; // end done
    };
})();