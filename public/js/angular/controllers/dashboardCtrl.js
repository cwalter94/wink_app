var dashboardCtrl = app.controller('dashboardCtrl', function($scope, me, plugs, banks) {
    $scope.plugs = plugs;
    $scope.banks = banks;

});