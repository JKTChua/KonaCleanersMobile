function SuspendController($rootScope, $scope, blockUI, dialogs) {
    $scope.Customer = CustomerConnect.Config.Customer;
    $scope.Cancellation = { Comments: '' };

    // Date Control
    $scope.open = function ($event, start) {
        $scope.openedStart = false;
        $scope.openedEnd = false;

        $event.preventDefault();
        $event.stopPropagation();

        if (start) {
            $scope.openedStart = true;
        } else {
            $scope.openedEnd = true;
        }

    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.dateFormat = 'MM-dd-yyyy';
    $scope.minDate = Date.now();
    $scope.initDate = Date.now();
    $scope.maxDate = moment().add(6, 'months');

    $scope.scheduleCancellation = function () {
        CustomerConnect.Route.SaveCancellationRequest($scope.Cancellation)
            .done(function (data) {
                dialogs.notify('Success', 'Your suspension scheduled has been from ' + moment($scope.Cancellation.FromDate).format('MM-DD-YYYY') + ' to ' + moment($scope.Cancellation.ToDate).format('MM-DD-YYYY') + '.');
                $scope.cancellationForm.$setPristine();
                $scope.Cancellation = { FromDate: null, ToDate: null, Comments: '' };
            }).fail(function (data) {
                dialogs.error('Error', 'Your suspension was not able to be scheduled. Please try again.');
            });
    };

    $scope.pendingSuspensions = function () {
        CustomerConnect.Route.PendingCancellations()
            .done(function (data) {
                var dlg = dialogs.create('Components/Dialogs/Suspensions.html', 'SuspensionsController', data.ReturnObject);
            }).fail(function (data) {
                dialogs.error('Error', 'Unable to display pending suspensions.');
            });
    };
};