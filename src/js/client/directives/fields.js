angular.module('www.tekuchi.converter').directive('fields', [function()         {
    return {
        restrict:       'E',
        scope:          {},
        templateUrl:    'templates/directives/fields.html',
        controller:     ['$scope', 'dataProvider',
            function($scope, dataProvider)                                      {
                $scope.types        = [];
                for (var i in dataProvider.types) $scope.types.push(dataProvider.types[i]);
                //
                $scope.fields       = null;
                $scope.$watchCollection(function(){ return dataProvider.fields;}, function() {
                    $scope.fields       = dataProvider.fields;
                });
            }
        ]
    };
}]);
