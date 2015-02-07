var app = angular.module('ngApp', ['ui.utils', 'angular-loading-bar', 'ngAnimate', 'ui.select',
    'angular-flash.service', 'angular-flash.flash-alert-directive', 'ui.router', 'mgcrea.ngStrap'], function () {

})
    .config(function (uiSelectConfig, flashProvider, $httpProvider, $stateProvider, $urlRouterProvider, $locationProvider, cfpLoadingBarProvider) {

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
                controller: function($scope) {

                }
            })
            .state('site.login', {
                url: '/login',
                templateUrl: '/partials/outer/login',
                controller: function($scope, principal, $state, flash) {
                    $scope.submitForm = function(formData) {
                        principal.login(formData).then(function(response){
                            $state.transitionTo('site.auth.dashboard');
                        }, function(err) {
                            flash.error = err;
                        })
                    }
                }
            })
            .state('site.register', {
                url: '/register',
                templateUrl: '/partials/outer/register',
                controller: function($scope, principal, $state, flash) {
                    $scope.submitForm = function(formData) {
                        principal.register(formData).then(function(response){
                            $state.transitionTo('site.auth.dashboard');
                        }, function(err) {
                            flash.error = err;
                        })
                    }
                }
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
                              $state.transitionTo('site.login');
                              return null;
                          }
                      })
                  }]
                },
                controller: function($scope, principal, $state, flash) {

                }

            })
            .state('site.auth.dashboard', {
                url: '/dashboard',
                templateUrl: '/partials/outer/dashboard',
                resolve: {
                    plugs: ['userFactory', function(userFactory) {
                        return userFactory.getPlugs().then(function(plugs) {
                            return plugs;
                        }, function(err) {
                            console.log(err);
                            return null;
                        })
                    }],
                    banks: ['userFactory', function(userFactory) {
                        return userFactory.getBanks().then(function(banks) {
                            return banks;
                        }, function(err) {
                            console.log(err);
                            return null;
                        })
                    }]
                },
                controller: 'dashboardCtrl'
            });

        $urlRouterProvider.otherwise('/');

    })
    .constant('WINK', {
        api: 'https://winkapi.quirky.com',
        client_id: '2ec4f93efd4390a33f6b8dcb12875377',
        client_secret: 'd7d606469be78ac2a3fce4e5419ab4f1',
        access_token: '',
        refresh_token: ''
    })

    .factory('principal', ['$q', '$http', '$window', '$state', 'WINK',
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

                        }).error(function(err) {
                            console.log(err);
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
    ])
    .factory('userFactory', function($http, $q, WINK) {
        var _plugs = null, _banks = null;
        return {
            getPlugs: function() {
                var deferred = $q.defer();

                if (_plugs) {
                    deferred.resolve(_plugs);
                }
                $http({
                    url: WINK.api + 'users/me/outlets',
                    method: 'GET'
                }).success(function(response) {
                    console.log(response);
                    deferred.resolve(response.data);
                }).error(function(err) {
                    console.log(err);
                    deferred.reject(err);
                });
                return deferred.promise;
            },
            getBanks: function() {
                var deferred = $q.defer();

                if (_banks) {
                    deferred.resolve(_plugs);
                }

                $http({
                    url: WINK.api + 'users/me/piggy_banks',
                    method: 'GET'
                }).success(function(response) {
                    console.log(response);
                    deferred.resolve(response.data);
                }).error(function(err) {
                    console.log(err);
                    deferred.reject(err);
                });
                return deferred.promise;
            }
        }
    })
    .factory('authInterceptor', function ($rootScope, $q, WINK) {
        return {
            request: function (config) {

                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + WINK.auth_token;
                return config;
            },
            response: function (response) {
                return response || $q.when(response);
            }
        };
    })

    .run(['$rootScope', '$state', '$stateParams', 'principal',
        function ($rootScope, $state, $stateParams, principal) {


        }
    ]);