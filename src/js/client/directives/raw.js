angular.module('www.tekuchi.converter').directive('raw', [function()            {
    return {
        restrict:       'E',
        scope:          {},
        templateUrl:    'templates/directives/raw.html',
        controller:     ['$scope', 'dataProvider',
            function($scope, dataProvider)                                      {
                $scope.fields       = null;
                $scope.rows         = null;
                //
                $scope.$watchCollection(function(){ return dataProvider.rows;}, function() {
                    $scope.rows     = dataProvider.rows;
                });
                $scope.$watchCollection(function(){ return dataProvider.fields;}, function() {
                    $scope.fields   = dataProvider.fields;
                });
            }
        ]
    };
}]);
