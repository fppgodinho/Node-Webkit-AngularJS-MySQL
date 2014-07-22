'use strict';

angular.module('www.tekuchi.converter', [], function ($compileProvider)         {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data|blob):/);
});




/**
 * 
 * This process aims to capture the browser's vertical scrollbar width and
 * strore the value in the config service under a variable called 'SCROLLBAR_WIDTH'.
 * 
 * @param {window} $window The global angular reference to the window DOMElement.
 */
angular.module('www.tekuchi.converter').run(['$window', 'config', function($window, config) {
    var outer                   = $window.document.createElement("div");
    outer.style.visibility      = "hidden";
    outer.style.width           = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
    $window.document.body.appendChild(outer);
    var widthNoScroll           = outer.offsetWidth;
    //
    outer.style.overflow        = "scroll";
    var inner                   = $window.document.createElement("div");
    inner.style.width           = "100%";
    outer.appendChild(inner);
    var widthWithScroll         = inner.offsetWidth;
    //
    outer.parentNode.removeChild(outer);
    //
    config.SCROLLBAR_WIDTH      = widthNoScroll - widthWithScroll;
}]);

angular.module('www.tekuchi.converter').run(['$window',
    function($window)                                                           {
        // Load native UI library
        var gui     = require('nw.gui');
        
        // Create a tray icon
        var tray    = new gui.Tray({ title: 'Tray', icon: 'media/16x16.png' });
        
        // Give it a menu
        var menu    = new gui.Menu();
        menu.append(new gui.MenuItem({ type: 'checkbox', label: 'box1' }));
        
        tray.menu   = menu;
    }
])
angular.module('www.tekuchi.converter').factory('config', [
    function()                                                                  {
        return {
            SCROLLBAR_WIDTH:     0
        };
    }
]);

angular.module('www.tekuchi.converter').factory('dataProvider', [
    function()                                                                  {
        var csv         = require('to-csv');
        var service     = {};
        var rows        = [];
        
        function chooseTypeFor(field)                                           {
            var type    = service.types[0];
            
            for (var i in service.types) {
                var item    = service.types[i];
                var weight  = item.name.length/field.length;
                if (item.special || field.toLowerCase().indexOf(item.name.toLowerCase()) < 0 || item.weight > weight) continue;
                //
                if (item.field) for (var j in service.fields) if (service.fields[j].name == item.field)
                    service.fields[j].type = service.types[0]
                
                item.field  = field;
                item.weight = weight;
                type        = item;
            }
            
            return type;
        }
        
        function resetTypes()                                                   {
            for (var i in service.types) service.types[i].field = '';
        }
        
        service.types   = [
            {name: '-',                 special:true},
            {name: 'model',             special:true},
            {name: 'metadata',          special:true},
            {name: 'block',             order: 1,   field: '',  weight: 0},
            {name: 'floor',             order: 2,   field: '',  weight: 0},
            {name: 'name',              order: 3,   field: '',  weight: 0},
            {name: 'type',              order: 4,   field: '',  weight: 0},
            {name: 'typology',          order: 5,   field: '',  weight: 0},
            {name: 'state',             order: 6,   field: '',  weight: 0},
            {name: 'flippable',         order: 7,   field: '',  weight: 0},
            {name: 'release',           order: 8,   field: '',  weight: 0},
            {name: 'inactive',          order: 9,   field: '',  weight: 0},
            {name: 'totalAreaFT',       order: 10,  field: '',  weight: 0},
            {name: 'totalAreaM',        order: 11,  field: '',  weight: 0},
            {name: 'terraceArea',       order: 12,  field: '',  weight: 0},
            {name: 'balconyArea',       order: 13,  field: '',  weight: 0},
            {name: 'beds',              order: 14,  field: '',  weight: 0},
            {name: 'aspect',            order: 15,  field: '',  weight: 0},
            {name: 'overlay',           order: 16,  field: '',  weight: 0},
            {name: 'penthouse',         order: 17,  field: '',  weight: 0},
            {name: 'parking',           order: 18,  field: '',  weight: 0},
            {name: 'cost',              order: 19,  field: '',  weight: 0},
            {name: 'category',          order: 20,  field: '',  weight: 0},
            {name: 'floors',            order: 21,  field: '',  weight: 0},
            {name: 'house',             order: 22,  field: '',  weight: 0},
            {name: 'estServCharge',     order: 23,  field: '',  weight: 0},
            {name: 'estServChargeRate', order: 24,  field: '',  weight: 0},
            {name: 'rentWeekly',        order: 25,  field: '',  weight: 0},
            {name: 'rentAnnual',        order: 26,  field: '',  weight: 0},
            {name: 'netYeld',           order: 27,  field: '',  weight: 0},
            {name: 'grossYeld',         order: 28,  field: '',  weight: 0},
            {name: 'pricePerSqrFeet',   order: 29,  field: '',  weight: 0}
        ];
        //
        service.fields  = [];
        service.rows    = [];
        service.setData = function(data)                                        {
            resetTypes();
            service.fields.length    = 0;
            service.rows.length      = 0;
            if (!data.length) return;
            //
            var template    = data[0];
            for (var property in template) service.fields.push({name: property, value: template[property], type: chooseTypeFor(property), extra: ''});
            for (var i in data) service.rows.push(data[i]);
        };
        
        service.translateAvail = function(val)                                  {
            var parsedVal = (val + '').toLowerCase();
            
            switch(parsedVal)                                                   {
                case '0':   return 'unreleased';
                case '1':   return 'sold';
                case '2':   return 'reserved';
                case '3':   return 'reserved';
                case '4':   return 'reserved';
                case '5':   return 'available';
                case '6':   return 'hold';
                default:    return val; 
            }
        };

        service.toFile = function(data)                                         {
            if (!data || !data.length) return '';
            var csvData     = csv(data); 
            var blob        = new Blob([csvData], {type: "application/csv"});
            return URL.createObjectURL(blob);
        }
        
        //
        return service;
    }
]);

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
