function SpecialsController($scope, $ionicModal, $http) {
    // Init
    $scope.Specials = [];
    $scope.clickedSpecial;
    $http
    .get('https://konacleaners.com/connect/api/getSpecials.php', {params:{'business':'Kona Cleaners'}})
    .then(function (res) {
        $scope.businessId = res.data.business.id;
        for(var x = 0; x < res.data.images.length; x++) {
            $scope.Specials.push({'specialImage':'http://becreative360.net/platform/uploads/'+res.data.images[x].uri, 'order':res.data.images[x].sort, 'specialTitle':res.data.images[x].title, 'id':res.data.images[x].id});
        }
    });

    $scope.openSpecial = function (clicked) {
        $scope.clickedSpecial = clicked;
        $scope.modal.show();
    };

    // Create the special modal that we will use later
    $ionicModal.fromTemplateUrl('MobileComponents/Specials/SpecialModal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the special modal to close it
    $scope.closeSpecial = function() {
        $scope.modal.hide();
    };
};