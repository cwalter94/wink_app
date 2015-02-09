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

    //load demo data if no powerstrips connected
    if ($scope.powerstrips == null) {
      $scope.powerstrips = [
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
      ]
    }

    //load demo data if no piggy banks connected

    if ($scope.banks == null) {
        $scope.banks = [
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

        ]
    }

    $scope.newCharge = function(bank) {
        bank.charges.push({
            amount: bank.selectedHours * bank.selectedOutlet.rate * 100,
            date: Date.now(),
            outlet_id: bank.selectedOutlet.outlet_id
        });
        bank.selectedOutlet.expiration = Date.now() + 3600 * bank.selectedHours;
        bank.newChargeContainerVisible = false;
        bank.selectedOutlet = null;
        bank.selectedHours = 1;

    };


});