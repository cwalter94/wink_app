var userFactory = app.factory('userFactory', function($http, $q, WINK) {
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
});