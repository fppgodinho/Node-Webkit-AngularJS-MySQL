angular.module('www.tekuchi.converter').directive('connection', [function()     {
    return {
        restrict:       'E',
        scope:          {},
        templateUrl:    'templates/directives/connection.html',
        controller:     ['$scope', '$http', 'dataProvider',
            function($scope, $http, dataProvider)                               {
                var master  = {
                    address:    'localhost',
                    port:       3306,
                    username:   'root',
                    password:   'root',
                    database:   'apartmentfinder',
                    table:      'londondock'
                };
                
                $scope.connect  = function ()                                   {
                    $http.get('http://localhost:8888/connect' + requestString($scope.server)
                    ).error(function(data)                                      {
                        console.log('Error', data);
                    }).success(function(data)                                   {
                        switch(data.type)                                       {
                            case 'success':
                                dataProvider.setData(data.message || []); 
                                break;
                            case 'error':
                                console.log('Error', data.message);
                                break;
                            default:
                                console.log('Error', data.message);
                                break;
                        }
                    });
                };
                
                $scope.reset    = function ()                                   {
                    $scope.server   = angular.copy(master);
                    if ($scope.form) $scope.form.$setDirty(false);
                };
                $scope.reset();
                
                function requestString(object)                                  {
                    return '?host=' + object.address +
                        '&port='        + object.port +
                        '&username='    + object.username +
                        '&password='    + object.password +
                        '&database='    + object.database +
                        '&table='       + object.table
                }
            }
        ]
    };
}]);
