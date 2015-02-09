var authInterceptor = app.factory('authInterceptor', function ($rootScope, $q, WINK) {
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
    })