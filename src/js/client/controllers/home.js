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
