'use strict';

angular.module('www.tekuchi.converter', ['ngRoute']);

angular.module('www.tekuchi.converter').config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/',                    {controller: 'home',                templateUrl:'templates/views/home.html',           reloadOnSearch:false});
    $routeProvider.otherwise({redirectTo: '/'});
}]);

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
        
        require('nw.gui').Window.get().showDevTools();
    }
])
angular.module('www.tekuchi.converter').service('config', [
    function($location)                                                         {
        return {
            SCROLLBAR_WIDTH:     0
        };
    }
]);

angular.module('www.tekuchi.converter').controller('home', ['$scope', '$http',
    function($scope)                                                            {
        var mysql      = require('mysql2');
        //
        $scope.master = {
            address:    'localhost',
            port:       3306,
            username:   'root',
            password:   'root',
            database:   'test',
            table:      'test'
        };
        
        console.log('Version: ', process.versions);
        
        $scope.connect  = function ()                                           {
            var address     = $scope.server.address + "";
            var port        = $scope.server.port * 1;
            var username    = $scope.server.username + "";
            var password    = $scope.server.password + "";
            var database    = $scope.server.database + "";
            console.log(address, port, username, password, database);
            
            var connection = mysql.createConnection({
                charset:    'UTF8_GENERAL_CI',
                debug:      false,
                host:       address,
                port:       port,
                user:       username,
                password:   password,
                database:   database
            }).on('error', function (err)                                       {
                console.log('Error', password === 'root', ">" + password + "<", err);
            });
            
            connection.connect(function(err)                                    {
                if (!err) {
                    console.log('Connected!', password === 'root', ">" + password + "<");
//                    var strQuery = "SELECT * FROM " + $scope.server.table;
//                    var strQuery = "SELECT * FROM " + connection.escape($scope.server.table);
//                    console.log(strQuery);
                    connection.query( "SELECT * FROM ??", $scope.server.table, function(err, rows) {
                        if(err) console.log('ERROR: ' + err);
                        else console.log( rows );
                    });
                    connection.end();
                }
            });
            
            return false;
        };
        
        $scope.reset    = function ()                                           {
            $scope.server   = angular.copy($scope.master);
            if ($scope.form) $scope.form.$setDirty(false);
        };
        $scope.reset();
    }
]);
