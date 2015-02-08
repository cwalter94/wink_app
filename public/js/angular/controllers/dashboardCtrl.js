var dashboardCtrl = app.controller('dashboardCtrl', function($scope,powerstrips, banks, userFactory, flash) {
    $scope.powerstrips = powerstrips;
    console.log($scope.powerstrips);
    $scope.banks = banks;

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
                      "name" : ""
                  },
                  {
                      "outlet_id": "u59h-654fee_ih17af5",
                      "outlet_index": 1,
                      "powered": false,
                      "name" : ""
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
                      "name" : ""
                  },
                  {
                      "outlet_id": "u59h-654fee_ih17af6",
                      "outlet_index": 1,
                      "powered": false,
                      "name" : ""

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
                      "name" : ""

                  },
                  {
                      "outlet_id": "u59h-654fee_ih17af8",
                      "outlet_index": 1,
                      "powered": false,
                      "name" : ""

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
                "name": "Beer money",
                "balance": 19217,
                "last_deposit_amount": 25,
                "nose_color": "00ff00",
                "savings_goal": 5000,
                "charges" : [{
                    date: Date.now(),
                    amount:25,
                    outlet_id: "1tq1-654fed_18y5"
                }]
            },
            {
                "piggy_bank_id": "sadjidbbb_201b2",
                "name": "Beer money",
                "balance": 19217,
                "last_deposit_amount": 25,
                "nose_color": "00ff00",
                "savings_goal": 5000,
                "charges" : [{
                    date: Date.now(),
                    amount:25,
                    outlet_id: "1tq1-654fed_18y5"
                }]
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
                }]
            },
            {
                "piggy_bank_id": "sadjidbbb_201b4",
                "name": "Beer money",
                "balance": 19217,
                "last_deposit_amount": 25,
                "nose_color": "00ff00",
                "savings_goal": 5000,
                "charges" : [{
                    date: Date.now(),
                    amount:25,
                    outlet_id: "1tq1-654fed_18y5"
                }]
            }

        ]
    }

});