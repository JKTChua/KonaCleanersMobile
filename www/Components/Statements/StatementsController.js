function StatementsController($scope, dialogs, blockUI, $filter) {
    $scope.filteredStatements = [];
    $scope.Statements = [];
    $scope.itemsPerPage = 5;
    $scope.currentPage = 1;

    $scope.numPages = function () {
        return Math.ceil($scope.Statements.length / $scope.numPerPage);
    };

    $scope.figureOutStatementsToDisplay = function () {
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = begin + $scope.itemsPerPage;
        $scope.$apply(function () {
            $scope.filteredStatements = [];
            if ($scope.Statements) {
                $scope.filteredStatements = $scope.Statements.slice(begin, end);
            }
        });
    };

    $scope.pageChanged = function () {
        $scope.figureOutStatementsToDisplay();
    };

    $scope.LoadStatements = function () {
        CustomerConnect.AR.GetStatementsList()
            .done(function (data) {
                var orderBy = $filter('orderBy');
                $scope.Statements = orderBy(data.ReturnObject, 'StatementDate', true);
                $scope.figureOutStatementsToDisplay();
            }).fail(function (data) {
                dialogs.error('Load failed.', data.Message);
$scope.LogOut();
                $scope.filteredStatements = [];
            });
    };

    $scope.ShowStatement = function (key) {
        $scope.key = key;

        var dlg = dialogs.create('Components/Dialogs/Statement.html', 'StatementController', $scope.key, 'lg');
    };

    $scope.init = function () {
        $scope.LoadStatements();
    };

    $scope.init();
};