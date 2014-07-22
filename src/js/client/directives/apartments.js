angular.module('www.tekuchi.converter').directive('apartments', [function()     {
    return {
        restrict:       'E',
        scope:          {},
        templateUrl:    'templates/directives/apartments.html',
        controller:     ['$scope', 'dataProvider',
            function($scope, dataProvider)                                      {
                //
                $scope.fields       = [];
                $scope.rows         = [];
                //
                $scope.$watch(function(){ return dataProvider.fields;}, function() {
                    $scope.fields.length    = 0;
                    var state           = null;
                    
                    for (var i in dataProvider.fields)                          {
                        var field   = dataProvider.fields[i];
                        if (field.type && !field.type.special)                  {
                            $scope.fields.push(field)
                            if (field.type.name == 'state') state = field; 
                        }
                    }
                    $scope.fields.sort(function(a, b)                           {
                        return a.type.order - b.type.order;
                    });
                    
                    var data            = [];
                    $scope.rows.length  = 0;
                    for (var i in dataProvider.rows)                            {
                        var row             = angular.copy(dataProvider.rows[i]);
                        if (state) row[state.name] = dataProvider.translateAvail(row[state.name]);
                        $scope.rows.push(row);
                        
                        var item    = {};
                        for (var j in $scope.fields)                            {
                            var field = $scope.fields[j];
                            item[field.type.name] = row[field.name];
                        }
                        data.push(item);
                    }
                    
                    $scope.export   = dataProvider.toFile(data);
                }, true);
            }
        ]
    };
}]);
