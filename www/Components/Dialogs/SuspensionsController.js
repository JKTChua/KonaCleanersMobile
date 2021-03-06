﻿function SuspensionsController($scope, $modalInstance, blockUI, data, dialogs) {
    $scope.Cancellations = { PendingCancellations: data };

    $scope.filteredCancellations = [];
    $scope.itemsPerPage = 5;
    $scope.currentPage = 1;

    $scope.numPages = function () {
        return Math.ceil($scope.Cancellations.PendingCancellations.length / $scope.itemsPerPage);
    };

    $scope.figureOutCancellationsToDisplay = function () {
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = begin + $scope.itemsPerPage;
        $scope.filteredCancellations = [];

        if ($scope.Cancellations.PendingCancellations != null) {
            if ($scope.Cancellations.PendingCancellations.length > 0) {
                $scope.filteredCancellations = $scope.Cancellations.PendingCancellations.slice(begin, end);
            }
        }
    };

    $scope.pageChanged = function () {
        $scope.figureOutCancellationsToDisplay();
    };

    $scope.done = function () {
        $modalInstance.close($scope.data);
    }; // end done

    $scope.figureOutCancellationsToDisplay();
}