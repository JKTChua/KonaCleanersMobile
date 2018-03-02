function LocationsController($scope, dialogs, blockUI, $filter, $modal) {
    // Init
    $scope.Stores = null;
    $scope.Customer = CustomerConnect.Config.Customer;

    // Load orders, at init and on status and date changes.
    $scope.LoadStores = function () {
        CustomerConnect.Store.GetStoreList()
        .done(function (data) {
            $scope.$apply(function () {
                $scope.Stores = data.ReturnObject;
                console.log($scope.Stores);
            });
        }).fail(function(data) {
            dialogs.error('Load failed.', data.Message);
$scope.LogOut();
            $scope.filteredOrders = [];
        });
    };

    // Show Order
    $scope.ShowOrder = function (key, orders) {
        $scope.data = { key: key, orders: orders };

        var dlg = dialogs.create('Components/Dialogs/Order.html', 'OrderController', $scope.data, { size: 'md' });
    };

    // Get first data.
    $scope.LoadStores();
};