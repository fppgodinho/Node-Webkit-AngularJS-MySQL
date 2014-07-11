var http    = require('http');
var url     = require('url');
var mysql   = require('mysql2');

http.createServer(function (req, res)                                           {
    var urlData = url.parse(req.url, true)
    var path    = urlData.pathname.split('/');
    var query   = urlData.query;
    var i       = 0;
    while (i < path.length) if (!path[i].length) path.splice(i, 1); else i++;
    
    res.writeHead(200, {'Content-Type': 'text/plain'});
    
    if (path.length) switch(path[0])                                            {
        case 'connect': connect(query, res); break;
        default:        res.end(JSON.stringify({type: 'error', code:'badCommand', message:'Command is not recognized'})); break;
    } else res.end(JSON.stringify({type: 'error', code:'noCommand', message:'Missing Command'}));
    
}).listen(8888, '127.0.0.1');

function connect(data, response)                                                {
    var connection = mysql.createConnection({
        charset:    'UTF8_GENERAL_CI',
        debug:      false,
        host:       data.address,
        port:       data.port,
        user:       data.username,
        password:   data.password,
        database:   data.database
    }).on('error', function (err)                                               {
        response.end(JSON.stringify({type: 'error', code:'connectionFailed', message:err}));
    });
    
    connection.connect(function(err)                                            {
        if (!err)                                                               {
            connection.query( "SELECT * FROM ??", data.table, function(err, rows) {
                if(err) response.end(JSON.stringify({type: 'error', code:'queryFailed', message:err}));
                else response.end(JSON.stringify({type: 'success', message:rows}));
            });
            connection.end();
        }
    });
}

