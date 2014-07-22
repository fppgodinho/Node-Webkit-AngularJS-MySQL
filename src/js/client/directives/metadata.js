angular.module('www.tekuchi.converter').directive('metadata', [function()       {
    return {
        restrict:       'E',
        scope:          {},
        templateUrl:    'templates/directives/metadata.html',
        controller:     ['$scope', 'dataProvider',
            function($scope, dataProvider)                                      {
                $scope.metadata     = [];
                //
                $scope.$watch(function(){ return dataProvider.fields;}, function() {
                    $scope.metadata.length  = 0;
                    var metaFields          = [];
                    var blockField          = null;
                    var floorField          = null;
                    var nameField           = null;
                    
                    for (var i in dataProvider.fields)                          {
                        var field   = dataProvider.fields[i];
                        if (field.type && !field.type.special  && field.type.name == 'block')   blockField  = field; 
                        if (field.type && !field.type.special  && field.type.name == 'floor')   floorField  = field; 
                        if (field.type && !field.type.special  && field.type.name == 'name')    nameField   = field;
                        if (field.type && field.type.special && field.type.name == 'metadata')  metaFields.push(field);
                    }
                    if (!metaFields.length || !blockField || !floorField || !nameField) return;
                    
                    var fileData = [];
                    for (var i in dataProvider.rows)                            {
                        var row     = dataProvider.rows[i];
                        var block   = row[blockField.name];
                        var floor   = row[floorField.name];
                        var name    = row[nameField.name];
                        
                        for (var j in metaFields)                               {
                            var field   = metaFields[j];
                            var meta    = field.extra || field.name;
                            var data    = row[field.name]; 
                            if (data)                                           {
                                var item =                                      {
                                    block:  block,
                                    floor:  floor,
                                    name:   name,
                                    meta:   meta,
                                    data:   data
                                }
                                $scope.metadata.push(item);
                                fileData.push(item);
                            }
                        }
                    }
                    
                    $scope.export   = dataProvider.toFile(fileData);
                    
                }, true);
            }
        ]
    };
}]);
