var app = angular.module('ngApp', ['ui.utils', 'angular-loading-bar', 'ngAnimate', 'ui.select',
    'angular-flash.service', 'angular-flash.flash-alert-directive', 'ui.router', 'ui.bootstrap',
    'xeditable', 'timer'], function () {

})
    .config(['uiSelectConfig', 'flashProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', 'cfpLoadingBarProvider', function (uiSelectConfig, flashProvider, $httpProvider, $stateProvider, $urlRouterProvider, $locationProvider, cfpLoadingBarProvider) {

        $locationProvider.html5Mode(true).hashPrefix('!');
        $httpProvider.interceptors.push('authInterceptor');
        flashProvider.errorClassnames.push('alert-danger');
        flashProvider.successClassnames.push('alert-success');
        cfpLoadingBarProvider.latencyThreshold = 50;

        $stateProvider.state('site', {
            abstract: true,
            templateUrl: '/partials/outer/site',
            controller: 'siteCtrl',
            url: ''
        })
            .state('site.home', {
                url: '/',
                templateUrl: '/partials/outer/home',
                controller: ['$scope', function($scope) {

                }]
            })
            .state('site.login', {
                url: '/login',
                templateUrl: '/partials/outer/login',
                controller: ['$scope', 'principal', '$state', 'flash', function($scope, principal, $state, flash) {
                    $scope.submitForm = function(formData) {
                        principal.login(formData).then(function(response){
                            $state.transitionTo('site.auth.dashboard');
                        }, function(err) {
                            flash.error = err;
                        })
                    }
                }]
            })
            .state('site.register', {
                url: '/register',
                templateUrl: '/partials/outer/register',
                controller: ['$scope', 'principal', '$state', 'flash', function($scope, principal, $state, flash) {
                    $scope.submitForm = function(formData) {
                        principal.register(formData).then(function(response){
                            $state.transitionTo('site.auth.dashboard');
                        }, function(err) {
                            flash.error = err;
                        })
                    }
                }]
            })

            .state('site.auth', {
                abstract: true,
                templateUrl: '<ui-view></ui-view>',
                resolve: {
                    me: ['principal', '$state', function(principal, $state) {
                        return principal.identity().then(function(response) {
                            if (response) {
                                return response;
                            } else {
                                return null;
                            }
                        }, function(err) {
                            $state.transitionTo('site.login');
                            return null;
                        })
                    }]
                },
                controller: ['$scope', 'principal', 'me', '$state', 'flash', function($scope, principal, me, $state, flash) {

                }]

            })
            .state('site.auth.dashboard', {
                url: '/dashboard',
                templateUrl: '/partials/outer/dashboard',
                resolve: {
                    powerstrips: ['userFactory', function(userFactory) {
                        return userFactory.getPowerstrips().then(function(powerstrips) {
                            return powerstrips;
                        }, function(err) {
                            return null;
                        })
                    }],
                    banks: ['userFactory', function(userFactory) {
                        return userFactory.getBanks().then(function(banks) {
                            return banks;
                        }, function(err) {
                            return null;
                        })
                    }]
                },
                controller: 'dashboardCtrl'
            });

        $urlRouterProvider.otherwise('/');

    }])
    .constant('WINK', {
        api: 'https://winkapi.quirky.com',
        client_id: '2ec4f93efd4390a33f6b8dcb12875377',
        client_secret: 'd7d606469be78ac2a3fce4e5419ab4f1',
        access_token: '',
        refresh_token: ''
    })

    .run(['$rootScope', '$state', '$stateParams', 'principal', 'editableOptions',
        function ($rootScope, $state, $stateParams, principal, editableOptions) {
            editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'


        }
    ]);
;
var dashboardCtrl = app.controller('dashboardCtrl', ['$scope', 'powerstrips', 'banks', 'userFactory', 'flash', function($scope,powerstrips, banks, userFactory, flash) {
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


}]);;
var siteCtrl = app.controller('siteCtrl', ['$scope', 'principal', function($scope, principal) {
    $scope.principal = principal;
}]);;
var authInterceptor = app.factory('authInterceptor', ['$rootScope', '$q', 'WINK', function ($rootScope, $q, WINK) {
        return {
            request: function (config) {

                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + WINK.access_token;
                return config;
            },
            response: function (response) {
                return response || $q.when(response);
            }
        };
    }]);
var principal = app.factory('principal', ['$q', '$http', '$window', '$state', 'WINK',
    function ($q, $http, $window, $state, WINK) {

        var _identity = undefined,
            _authenticated = false,
            _verified = false;

        return {
            identity: function (force) {
                var deferred = $q.defer();
                // if this user already retrieved, resolve immediately
                if (angular.isDefined(_identity)) {
                    deferred.resolve(_identity);
                }
                // else call API to get user
                // (return user if already authenticated, otherwise resolve fails and user must authenticate)
                else {
                    $http({
                        url: WINK.api + '/oauth2/token',
                        method: 'GET',
                        params: {
                            "client_id": WINK.client_id,
                            "client_secret": WINK.client_secret,
                            "grant_type": "refresh_token",
                            "refresh_token": WINK.auth_token
                        }
                    }).success(function(response) {
                        _identity = response.data;
                        deferred.resolve(_identity);

                    }).error(function(err) {
                        console.log(err);
                        deferred.reject(err);
                    });

                }
                return deferred.promise;

            },
            login: function (credentials) {
                var deferred = $q.defer();
                $http({
                    url: WINK.api + '/oauth2/token',
                    method: 'POST',
                    data: {
                        "client_id": WINK.client_id,
                        "client_secret": WINK.client_secret,
                        "username": credentials.email,
                        "password": credentials.password,
                        "grant_type": "password"
                    },
                    headers: {'Content-Type': 'application/json'}

                }).success(function(response) {
                    WINK.access_token = response.data.access_token;
                    WINK.refresh_token = response.data.refresh_token;
                    _identity = response.data;
                    deferred.resolve(_identity);
                }).error(function(err) {
                    deferred.reject(err);
                    console.log(err);
                });

                return deferred.promise;
            },

            logout: function () {
                var deferred = $q.defer();

            },
            register: function (formData) {
                var deferred = $q.defer();

                $http({
                    url: WINK.api + '/users',
                    method: 'POST',
                    params: {
                        "client_id": WINK.client_id,
                        "client_secret": WINK.client_secret,
                        "email": formData.email,
                        "first_name": formData.firstName,
                        "last_name": formData.lastName,
                        "locale": "en_us",
                        "new_password": formData.password
                    }
                }).success(function(response) {
                    _identity = response.data;
                    WINK.access_token = response.data.access_token;
                    WINK.refresh_token = response.data.refresh_token;

                    deferred.resolve(_identity);
                }).error(function(err) {
                    deferred.reject(err);
                });

                return deferred.promise;
            }
        };
    }
]);
;
var userFactory = app.factory('userFactory', ['$http', '$q', 'WINK', function($http, $q, WINK) {
    var _plugs = null, _powerstrips = null, _banks = null;

    return {
        getPowerstrips: function() {
            var deferred = $q.defer();

            if (_powerstrips) {
                deferred.resolve(_powerstrips);
                return deferred.promise;
            }
            var demoPowerstrips = [
                {
                    "powerstrip_id": "testdata123deadbeef",
                    "outlets": [
                        {
                            "outlet_id": "1tq1-654fed_18y5",
                            "outlet_index": 0,
                            "powered": true,
                            "name" : "Living Room TV",
                            "rate" : 0.00,
                            expiration: null
                        },
                        {
                            "outlet_id": "u59h-654fee_ih17af5",
                            "outlet_index": 1,
                            "powered": false,
                            "name" : "Living Room Stereo",
                            "rate" : 0.00,
                            expiration: null
                        }
                    ]
                },
                {
                    "powerstrip_id": "testdata124deadbeef",
                    "outlets": [
                        {
                            "outlet_id": "1tq1-654fed_18y6",
                            "outlet_index": 0,
                            "powered": true,
                            "name" : "Sally Bedroom TV",
                            "rate" : 0.00,
                            expiration: null
                        },
                        {
                            "outlet_id": "u59h-654fee_ih17af6",
                            "outlet_index": 1,
                            "powered": false,
                            "name" : "Sally Bedroom Stereo",
                            "rate" : 0.00,
                            expiration: null

                        }
                    ]
                },
                {
                    "powerstrip_id": "testdata125deadbeef",
                    "outlets": [
                        {
                            "outlet_id": "1tq1-654fed_18y7",
                            "outlet_index": 0,
                            "powered": true,
                            "name" : "Bo Bedroom TV",
                            "rate" : 0.00,
                            expiration: null

                        },
                        {
                            "outlet_id": "u59h-654fee_ih17af8",
                            "outlet_index": 1,
                            "powered": false,
                            "name" : "Bo Bedroom Stereo",
                            "rate" : 0.00,
                            expiration: null

                        }
                    ]
                }
            ];

            for (var i = 0; i < demoPowerstrips.length; i++) {
                var p = demoPowerstrips[i];
                p.outlets[0].demoData = true;
                p.outlets[1].demoData = true;
            }

            $http({
                url: WINK.api + '/users/me/powerstrips',
                method: 'GET'
            }).success(function(response) {
                _powerstrips = [];
                if (response.data && response.data.length > 0) {
                    for (var i = 0; i < response.data.length; i++) {
                        response.data[i].name = "Unnamed Powerstrip";
                        response.data[i].outlets[0].rate = 0.25;
                        response.data[i].outlets[1].rate = 0.45;
                        response.data[i].outlets[0].expiration = response.data[i].outlets[1].expiration = null;

                        _powerstrips.push(response.data[i]);

                    }
                    deferred.resolve(_powerstrips);
                } else {
                    deferred.resolve(demoPowerstrips);
                }
            }).error(function(err) {
                deferred.resolve(demoPowerstrips);
            });
            return deferred.promise;
        },
        getBanks: function() {
            var deferred = $q.defer();

            if (_banks) {
                deferred.resolve(_banks);
                return deferred.promise;
            }
            var demoBanks = [
                {
                    "piggy_bank_id": "sadjidbbb_201b1",
                    "name": "Sally's money",
                    "balance": 19217,
                    "last_deposit_amount": 25,
                    "nose_color": "00ff00",
                    "savings_goal": 5000,
                    "charges" : [{
                        date: Date.now(),
                        amount:25,
                        outlet_id: "1tq1-654fed_18y5"
                    }],
                    selectedHours: 1
                },
                {
                    "piggy_bank_id": "sadjidbbb_201b2",
                    "name": "Bo's money",
                    "balance": 19217,
                    "last_deposit_amount": 25,
                    "nose_color": "00ff00",
                    "savings_goal": 5000,
                    "charges" : [{
                        date: Date.now(),
                        amount:25,
                        outlet_id: "1tq1-654fed_18y5"
                    }],
                    selectedHours: 1
                },
                {
                    "piggy_bank_id": "sadjidbbb_201b3",
                    "name": "Beer money",
                    "balance": 19217,
                    "last_deposit_amount": 25,
                    "nose_color": "00ff00",
                    "savings_goal": 5000,
                    "charges" : [{
                        date: Date.now(),
                        amount:25,
                        outlet_id: "1tq1-654fed_18y5"
                    }],
                    selectedHours: 1
                },
                {
                    "piggy_bank_id": "sadjidbbb_201b4",
                    "name": "Vacation money",
                    "balance": 19217,
                    "last_deposit_amount": 25,
                    "nose_color": "00ff00",
                    "savings_goal": 5000,
                    "charges" : [{
                        date: Date.now(),
                        amount:25,
                        outlet_id: "1tq1-654fed_18y5"
                    }],
                    selectedHours: 1
                }

            ];

            $http({
                url: WINK.api + '/users/me/piggy_banks',
                method: 'GET'
            }).success(function(response) {
                if (response.data.length > 0) {
                    for (var i = 0; i < response.data.length; i++) {
                        response.data[i].charges = [];
                        response.data[i].selectedHours = 1;
                        _banks.push(response.data[i]);
                    }
                    deferred.resolve(_banks);
                } else {
                    deferred.resolve(demoBanks);
                }
            }).error(function(err) {
                deferred.resolve(demoBanks);
            });
            return deferred.promise;
        },
        updateOutlet: function(outlet, powered) {
            var deferred = $q.defer();
            console.log("updateOutlet", outlet);
            if (!outlet.demoData) { // outlet is not demo data, call API to update
                $http({
                    url: WINK.api + '/outlets/' + outlet.outlet_id,
                    method: 'PUT',
                    data: {
                        "powered": powered
                    }
                }).success(function(response) {
                    deferred.resolve(response.data);
                }).error(function(err) {
                    deferred.reject(err);
                });
            } else {
                deferred.resolve(null); // outlet is demo data
            }
            return deferred.promise;
        }
    }
}]);