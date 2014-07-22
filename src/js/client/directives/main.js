angular.module('www.tekuchi.converter').directive('main', [function()           {
    return {
        restrict:       'E',
        scope:          {},
        templateUrl:    'templates/directives/main.html',
        controller:     ['$scope', 'dataProvider',
            function($scope, dataProvider)                                      {
                $scope.selected         = 'connection';
                $scope.connected        = false;
                //
                $scope.$watchCollection(function(){ return dataProvider.fields;}, function() {
                    $scope.connected    = dataProvider.fields.length?true:false;
                });
                
                var nwWindow  = require('nw.gui').Window.get();
                $scope.switchDebug = function() {
                    if (!nwWindow.isDevToolsOpen()) nwWindow.showDevTools();
                    else nwWindow.closeDevTools();
                };
            }
        ]
    };
}]);
