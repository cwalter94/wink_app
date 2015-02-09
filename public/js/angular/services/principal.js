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
