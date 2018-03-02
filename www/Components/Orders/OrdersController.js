(function () {
    'use strict';

    angular
    .module('starter.controllers')
    .controller('OrdersController', ['$scope', '$ionicPopup', '$ionicModal', '$filter', 'CustomerConnect', OrdersController]);

    function OrdersController($scope, $ionicPopup, $ionicModal, $filter, CustomerConnect) {
        // Init
        $scope.orderData = {};
        $scope.Orders = null;
        $scope.ReadyOrders = null;
        $scope.orderData.SingleOrder = null;
        $scope.orderData.currentPage = 1;
        $scope.Filters = { Status: 130, StartDate: moment().subtract(90, 'days').toDate() , EndDate: moment().toDate() };
        $scope.Customer = CustomerConnect.Config.Customer;

        $scope.filteredOrders = [];
        $scope.itemsPerPage = 10;
        $scope.currentPage = 1;

        $scope.filteredReadyOrders = [];
        $scope.readyCurrentPage = 1;

        $scope.numPages = function () {
            return Math.ceil($scope.Orders.length / $scope.numPerPage);
        };

        $scope.readyNumPages = function () {
            return Math.ceil($scope.ReadyOrders.length / $scope.numPerPage);
        };

        $scope.figureOutOrdersToDisplay = function () {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;
            $scope.filteredOrders = [];
            if ($scope.Orders) {
                $scope.filteredOrders = $scope.Orders.slice(begin, end);
            }
        };

        $scope.figureOutReadyOrdersToDisplay = function () {
            var begin = (($scope.readyCurrentPage - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;
            $scope.filteredReadyOrders = [];
            if ($scope.ReadyOrders) {
                $scope.filteredReadyOrders = $scope.ReadyOrders.slice(begin, end);
            }
        };

        $scope.pageChanged = function () {
            $scope.figureOutOrdersToDisplay();
        };

        $scope.readyPageChanged = function () {
            $scope.figureOutReadyOrdersToDisplay();
        };

        // Load orders, at init and on status and date changes.
        $scope.LoadOrders = function () {
            if ($scope.Filters.StartDate == null || $scope.Filters.EndDate == null) {
                return;
            }

            CustomerConnect.Invoice.GetInvoiceList($scope.Filters.Status, moment($scope.Filters.StartDate).startOf('day').format('MM/DD/YYYY HH:mm:ss'), moment($scope.Filters.EndDate).endOf('day').format('MM/DD/YYYY HH:mm:ss'))
                .then(function (data) {
                    var orderBy = $filter('orderBy');
                    $scope.Orders = orderBy(data.ReturnObject, 'DropoffDateTime', true);
                    $scope.figureOutOrdersToDisplay();
                }, function (data) {
                     // $ionicPopup.alert({title:'Load failed.', template: data.Message});
    // $scope.LogOut();
                    $scope.filteredOrders = [];
                });

            if ($scope.Filters.Status == '128') {
                CustomerConnect.Invoice.GetInvoiceList('129', moment($scope.Filters.StartDate).startOf('day').format('MM/DD/YYYY HH:mm:ss'), moment($scope.Filters.EndDate).endOf('day').format('MM/DD/YYYY HH:mm:ss'))
                    .then(function (data) {
                        var orderBy = $filter('orderBy');
                        $scope.ReadyOrders = orderBy(data.ReturnObject, 'DropoffDateTime', true);
                        $scope.figureOutReadyOrdersToDisplay();
                    }, function (data) {
                         // $ionicPopup.alert({title:'Load failed.', template: data.Message});
    // $scope.LogOut();
                        $scope.filteredReadyOrders = [];
                    });
            }
        };

        // Date Picker Functions:
        $scope.open = function ($event, start) {
            $event.preventDefault();
            $event.stopPropagation();

            if (start) {
                $scope.openedStart = true;
            } else {
                $scope.openedEnd = true;
            }
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };

        $scope.dateFormat = 'MM/dd/yyyy';

        // Show Order
        $scope.ShowOrder = function (key, orders) {
            $scope.orderData.InvoiceID = key
            $scope.orderData.Orders = orders;
            $scope.currentPage = 1;

            console.log(orders);

            for (var x = 0; x < orders.length; x++) {
                if (orders[x].InvoiceID == $scope.orderData.key) {
                    $scope.currentPage = x+1;
                    break;
                }
            }

            $scope.LoadOrder();
            $scope.modal.show();
        };

        $ionicModal.fromTemplateUrl('Components/Dialogs/Order.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Get first orderData.
        $scope.LoadOrders();

        //OrderController

        $scope.LoadOrder = function () {
            CustomerConnect.Invoice.GetInvoiceDetails($scope.orderData.InvoiceID)
                .then(function (data) {
                    $scope.orderData.SingleOrder = data.ReturnObject;
                    console.log(data.ReturnObject);
                }, function (data) {
                    $ionicPopup.alert({title: 'Load failed.', template: data.Message});
                    $scope.LogOut();
                });
        };

        $scope.close = function () {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.numPages = function () {
            return Math.ceil($scope.orderData.Orders.length / $scope.numPerPage);
        };

        $scope.showPromisedDate = function (pDate) {
            return ((new Date(pDate)).getTime() > 0)
        };

        $scope.orderPageChanged = function () {
            console.log($scope.orderData.Orders);
            console.log($scope.orderData.currentPage);
            $scope.orderData.InvoiceID = $scope.orderData.Orders[$scope.orderData.currentPage - 1].InvoiceID;
            $scope.LoadOrder();
            console.log($scope.orderData.InvoiceID);
        };
    };
})();