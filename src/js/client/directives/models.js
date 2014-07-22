angular.module('www.tekuchi.converter').directive('models', [function()         {
    return {
        restrict:       'E',
        scope:          {},
        templateUrl:    'templates/directives/models.html',
        controller:     ['$scope', 'dataProvider',
            function($scope, dataProvider)                                      {
                $scope.models           = [];
                $scope.circuits         = [];
                $scope.selected         = null
                var blockField          = null;
                var floorField          = null;
                var nameField           = null;
                //
                $scope.$watch(function(){ return dataProvider.fields;}, function() {
                    $scope.models.length    = 0;
                    
                    for (var i in dataProvider.fields)                          {
                        var field   = dataProvider.fields[i];
                        if (field.type && !field.type.special  && field.type.name == 'block')   blockField  = field;
                        if (field.type && !field.type.special  && field.type.name == 'floor')   floorField  = field;
                        if (field.type && !field.type.special  && field.type.name == 'name')    nameField   = field;
                        if (field.type && field.type.special && field.type.name == 'model')     $scope.models.push({name: field.name, circuits:[]});
                    }
                    
                    $scope.selected         = $scope.models.length?$scope.models[0]:null;
                }, true);
                
                $scope.$watch('selected', function()                            {
                    $scope.circuits.length  = 0;
                    
                    var fileData            = [];
                    for (var i in dataProvider.rows)                            {
                        var row         = dataProvider.rows[i];
                        var item        =                                       {
                            block:      row[blockField.name],
                            floor:      row[floorField.name],
                            name:       row[nameField.name],
                            circuits:   row[$scope.selected.name]
                        }
                        $scope.circuits.push(item);
                        fileData.push(item);
                    }

                    $scope.export   = dataProvider.toFile(fileData);
                });
                
            }
        ]
    };
}]);
