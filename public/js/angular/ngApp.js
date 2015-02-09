var app = angular.module('ngApp', ['ui.utils', 'angular-loading-bar', 'ngAnimate', 'ui.select',
    'angular-flash.service', 'angular-flash.flash-alert-directive', 'ui.router', 'ui.bootstrap',
    'xeditable', 'timer'], function () {

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
                                return null;
                            }
                        }, function(err) {
                            $state.transitionTo('site.login');
                            return null;
                        })
                    }]
                },
                controller: function($scope, principal, me, $state, flash) {

                }

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

    })
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
