var dashboardCtrl = app.controller('dashboardCtrl', function($scope,powerstrips, banks, userFactory, flash) {
    $scope.formatDate = function(charge) {
        var date = new Date(charge.date);
        var month = date.getMonth() + 1;
        return month + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
    };

    $scope.powerstrips = powerstrips;
    $scope.banks = banks;
    $scope.Math = Math;
    $scope.parseFloat = parseFloat;

    $scope.getDate = function(date) {
        return new Date(date);
    };

    $scope.newCharge = function(bank) {
        userFactory.updateOutlet(bank.selectedOutlet, true).then(function(response) {
            bank.charges.push({
                amount: bank.selectedHours * bank.selectedOutlet.rate * 100,
                date: Date.now(),
                outlet_id: bank.selectedOutlet.outlet_id
            });
            bank.selectedOutlet.expiration = Date.now() + 3600000 * bank.selectedHours;
            bank.newChargeContainerVisible = false;
            bank.selectedOutlet = null;
            bank.selectedHours = 1;
        }, function(err) {
            flash.error = 'An error occurred. Please try again later.'
        });
    };


});