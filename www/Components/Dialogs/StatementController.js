function StatementController($rootScope, $scope, $modalInstance, blockUI, data, dialogs) {
    $scope.StatementID = data;
    $scope.Orders = [];

    $scope.filteredItems = [];
    $scope.itemsPerPage = 10;
    $scope.currentPage = 1;

    $scope.numPages = function () {
        return Math.ceil($scope.Statement.StatementItems.length / $scope.numPerPage);
    };

    $scope.figureOutItemsToDisplay = function () {
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = begin + $scope.itemsPerPage;
        $scope.filteredItems = [];
        $scope.filteredItems = $scope.Statement.StatementItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
        $scope.figureOutItemsToDisplay();
    };

    $scope.findOrders = function () {
        for (var x = 0; x < $scope.Statement.StatementItems.length; x++) {
            if ($scope.Statement.StatementItems[x].InvoiceID != '00000000-0000-0000-0000-000000000000') {
                $scope.Orders.push($scope.Statement.StatementItems[x]);
            }
        }
    };

    $scope.LoadStatement = function () {
        CustomerConnect.AR.GetStatementDetails($scope.StatementID)
            .done(function (data) {
                $scope.$apply(function () {
                    $scope.Statement = data.ReturnObject;
                    $scope.figureOutItemsToDisplay();
                    $scope.findOrders();
                });
            }).fail(function (data) {
                dialogs.error('Load failed.', data.Message);
$scope.LogOut();
            });
    };

    // Show Order
    $scope.ShowOrder = function (key, orders) {
        $scope.data = { key: key, orders: orders };
        var dlg = dialogs.create('Components/Dialogs/Order.html', 'OrderController', $scope.data, 'sm');
    };

    $scope.close = function () {
        $modalInstance.close();
    };

    $scope.LoadStatement();
}