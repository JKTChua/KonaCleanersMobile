angular.module('starter.controllers', ['ui.mask'])

.service('userService', function () {
    this.setEmail = function (email) {
        this.email = email;
    }
    this.getEmail = function () {
        return this.email;
    }

    this.setCaptchaValid = function (captchaValid) {
        this.captchaValid = captchaValid;
    }
    this.getCaptchaValid = function () {
        return this.captchaValid;
    }

    this.setPassword = function (password) {
        this.password = password;
    }
    this.getPassword = function () {
        return this.password;
    }
})

.service('CustomerConnect', CustomerConnect)

.controller('AppCtrl', function($scope, $rootScope, $ionicPopup, $state, localStorageService, $filter, CustomerConnect, $q, $controller) {

    $scope.Connect = CustomerConnect.Config.Connected;

    $scope.changePass = $scope.$new();
    $scope.changePass.template = 'Components/Dialogs/ChangePassword.html';
    $controller('DialogController', {$scope: $scope.changePass});

    $scope.returnModal = function (data) {
        $scope.changePassword(data);
    };

    $scope.LogOut = function () {
        CustomerConnect.User.Logout()
        .then(function (data) {
            localStorageService.remove('token');
            $rootScope.LoggedIn = false;
            CustomerConnect.StartSession();
            $state.go('app.dashboard');
            // $location.path('/login');
            // window.location.reload(); // Reacquire new session.
        }, function (data) {
            localStorageService.remove('token');
            $rootScope.LoggedIn = false;
            CustomerConnect.StartSession();
            $state.go('app.dashboard');
            // $location.path('/login');
            // window.location.reload(); // Reacquire new session.
        });
    };

    $scope.changePassword = function (data) {
        if (typeof (data) !== 'undefined') {
            CustomerConnect.User.ChangePassword({ newPassword: data.Password })
            .then(function (cpData) {
                $ionicPopup.alert({title: 'Password Changed', template: 'Your password has been changed.'});
            }, function (cpData) {
                var dlg = $ionicPopup.alert({title: 'Error', template: cpData.Message});
                dlg.then(function () {
                    var dlg = $ionicPopup.alert({title: 'Password Change Required'});
                    dlg.then(function () {
                        $scope.changePass.open();
                    });
                });
            });
        }
    };

    function findInArray(arr, x) {
        for (var y = 0; y < arr.length; y++) {
            if (arr[y].typeId == x) {
                return y;
            }
        }
        return -1;
    }

    $scope.LoadSettings = function () {
        var deferred = $q.defer();
        CustomerConnect.Settings.GetSettings()
        .then(function (data) {
            CustomerConnect.Config.Settings = data.ReturnObject.CustomerConnectSettings;

            CustomerConnect.Settings.GetNotifications()
            .then(function (notifications) {
                CustomerConnect.Config.Settings.Notifications = notifications.ReturnObject;

                CustomerConnect.Settings.GetPreferences()
                .then(function (preferences) {
                    CustomerConnect.Config.Settings.Preferences = preferences.ReturnObject;

                    CustomerConnect.Store.GetStoreList()
                    .then(function (stores) {
                        CustomerConnect.Config.Settings.Stores = stores.ReturnObject;

                        localStorageService.set("ccCache", CustomerConnect.Util.base64._encode(JSON.stringify(CustomerConnect.Config.Settings)));
                        $scope.Loaded = true;
                        $scope.Settings = CustomerConnect.Config.Settings;
                        $rootScope.Settings = CustomerConnect.Config.Settings;

                        var notifications = $filter('orderBy')($scope.Settings.Notifications, ['Description', 'MethodName'], false);
                        $scope.Settings.Notifications = [];
                        for (var x = 0; x < notifications.length; x++) {
                            var y = findInArray($scope.Settings.Notifications, notifications[x].TypeID);
                            var z = notifications[x];

                            if (y == -1) {
                                $scope.Settings.Notifications.push({
                                    typeId: z.TypeID,
                                    name: z.Name,
                                    description: z.Description,
                                    abbr: z.Abbreviation,
                                    methods: [{
                                        methodId: z.MethodID,
                                        name: z.MethodName,
                                        description: z.MethodDescription,
                                        abbr: z.MethodAbbreviation,
                                        default: z.DefaultValue
                                    }]
                                });
                            } else {
                                $scope.Settings.Notifications[y].methods.push({
                                    methodId: z.MethodID,
                                    name: z.MethodName,
                                    description: z.MethodDescription,
                                    abbr: z.MethodAbbreviation,
                                    default: z.DefaultValue
                                });
                            }
                        }
                        if($rootScope.LoggedIn)
                            $scope.setCustomerNotificationOptions();
                        deferred.resolve();
                    });
                });
            });
        });
        return deferred.promise;
    };

    $scope.setCustomerNotificationOptions = function () {
        for (var x = 0; x < $scope.Customer.Notifications.length; x++) {
            for (var y = 0; y < $scope.Settings.Notifications.length; y++) {
                if ($scope.Customer.Notifications[x].NotificationTypeName == $scope.Settings.Notifications[y].name) {
                    // Found, get method.
                    for (var z = 0; z < $scope.Settings.Notifications[y].methods.length; z++) {
                        if ($scope.Customer.Notifications[x].NotificationMethodName == $scope.Settings.Notifications[y].methods[z].name) {
                            // Set as selected.
                            $scope.Settings.Notifications[y].selectedMethod = $scope.Settings.Notifications[y].methods[z];
                        }
                    }
                }
            }
        }
    };

    $scope.LoadUser = function () {
        if (localStorageService.get("token") != null) {
            CustomerConnect.Config.SessionId = localStorageService.get("token");

            CustomerConnect.Customer.GetCustomer()
            .then(function (data) {
                CustomerConnect.Config.Customer = data.ReturnObject;
                $rootScope.LoggedIn = true;
                $rootScope.Customer = CustomerConnect.Config.Customer;
                // $state.go('dashboard');
            }, function () {
                $ionicPopup.alert({title: 'Load Failed', template: 'Unable to retrieve customer data. Please login again.'});
                $scope.LogOut();
                localStorageService.remove('token');
            });
        } else if($state.current.name !== 'app.dashboard')
            $state.go('app.login');
    };

    $scope.openMyAccount = function () {
        if ($rootScope.LoggedIn)
            $state.go('app.ccdashboard');
        else
            $state.go('app.login');
    };

    $scope.backToDashboard = function () {
        $state.go('app.dashboard');
    };

    $scope.startSession = function () {
        $scope.SessionHTTPRequest = CustomerConnect.StartSession().then(function () {
            $scope.Connect = CustomerConnect.Config.Connected;
            $scope.Passed = true;
            $scope.Error = CustomerConnect.Config.Error;
            var deferred = $q.defer();
            $scope.LoadUser();
            $scope.LoadSettings().then(function() {
                deferred.resolve();
            });
            return deferred.promise;
        });
        return $scope.SessionHTTPRequest;
    };

    $scope.startSession();
})

.directive('currencyformatter', function ($filter) {
    var precision = 2;
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$formatters.push(function (data) {
                var formatted = $filter('currency')(data);
                //convert data from model format to view format
                return formatted; //converted
            });
            ctrl.$parsers.push(function (data) {
                var plainNumber = data.replace(/[^\d|\-+|\+]/g, '');
                var length = plainNumber.length;
                var intValue = plainNumber.substring(0, length - precision);
                var decimalValue = plainNumber.substring(length - precision, length)

                if (decimalValue.length < 2) {
                    decimalValue = "0" + decimalValue;
                }

                var plainNumberWithDecimal = intValue + '.' + decimalValue;
                //convert data from view format to model format
                var formatted = $filter('currency')(plainNumberWithDecimal);
                element.val(formatted);

                return Number(plainNumberWithDecimal);
            });
        }
    };
})

.directive('ccexpirationformatter', function ($filter) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$formatters.push(function (data) {
                //convert data from model format to view format
                if (typeof (data) != 'undefined') {
                    return moment(data, 'MM/DD/YYYY').format('MM/YY'); //converted
                } else {
                    return data;
                }
            });
            ctrl.$parsers.push(function (data) {
                var plainNumber = data.replace(/[^\d|\-+|\+]/g, '').toString();

                while (plainNumber.length < 4) {
                    plainNumber = "0" + plainNumber;
                }

                while (plainNumber.length > 4) {
                    plainNumber = plainNumber.substring(1, 5);
                }

                var length = plainNumber.length;
                var intValue = plainNumber.substring(0, 2);
                var decimalValue = plainNumber.substring(2, 4);

                if (Number(intValue) > 12) {
                    intValue = "12";
                }


                var plainNumberWithDecimal = intValue + '/' + decimalValue;

                element.val(plainNumberWithDecimal);

                return plainNumberWithDecimal;
            });

        } //link
    };
})

.filter('capitalize', function () {
    return function (input) {
        if (input.indexOf(' ') !== -1) {
            var inputPieces,
                i;

            input = input.toLowerCase();
            inputPieces = input.split(' ');

            for (i = 0; i < inputPieces.length; i++) {
                inputPieces[i] = capitalizeString(inputPieces[i]);
            }

            return inputPieces.toString().replace(/,/g, ' ');
        }
        else {
            input = input.toLowerCase();
            return capitalizeString(input);
        }

        function capitalizeString(inputString) {
            return inputString.substring(0, 1).toUpperCase() + inputString.substring(1);
        }
    };
})

.controller('StoreController', StoreController)

.controller('SpecialsController', SpecialsController);