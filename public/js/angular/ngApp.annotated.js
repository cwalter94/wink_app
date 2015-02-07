var app = angular.module('ngApp', ['ui.utils', 'angular-loading-bar', 'ngAnimate', 'ui.select',
    'angular-flash.service', 'angular-flash.flash-alert-directive', 'ui.router', 'mgcrea.ngStrap'], function () {

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
                    console.log("HOME STATE");
                }]
            });

        $urlRouterProvider.otherwise('/');

    }])
    .constant('WINK', {
        api: 'https://winkapi.quirky.com',
        client_id: '2ec4f93efd4390a33f6b8dcb12875377',
        client_secret: 'd7d606469be78ac2a3fce4e5419ab4f1',
        auth_token: ''
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
                            console.log(response.data);

                        }).error(function(err) {
                            console.log(err);
                        });

                    }
                    return deferred.promise;

                },
                login: function (credentials) {
                    var deferred = $q.defer();

                    $http.post({
                        url: WINK.api + '/oauth2/token',
                        method: 'POST',
                        params: {
                            "client_id": WINK.client_id,
                            "client_secret": WINK.client_secret,
                            "username": credentials.username,
                            "password": credentials.password,
                            "grant_type": "password"
                        }

                    }).success(function(response) {
                        deferred.resolve(response.data);
                        console.log(response);
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
                        deferred.resolve(response.data);
                        console.log(response);
                    }).error(function(err) {
                        deferred.reject(err);
                        console.log(err);
                    });

                    return deferred.promise;
                }
            };
        }
    ])
    .factory('authInterceptor', ['$rootScope', '$q', 'WINK', function ($rootScope, $q, WINK) {
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
    }])

    .run(['$rootScope', '$state', '$stateParams', 'principal',
        function ($rootScope, $state, $stateParams, principal) {


        }
    ]);;
var siteCtrl = app.controller('siteCtrl', ['$scope', 'principal', function($scope, principal) {
    $scope.principal = principal;
}]);