var http = require('http');
var urlLib = require('url');


function handleRequest(request, response){
    var parsedUrl = urlLib.parse(request.url);
    var options = {
        hostname: 'lenta.ru',
        port: 80,
        path: parsedUrl.href,
        method: request.method
    };
    console.log(options);
    var req = http.request(options, function(res){
        console.log('response:', res.statusCode);
        response.writeHead(res.statusCode, res.headers);
        res.on('data', function(chunk){
            response.write(chunk);
        });
        res.on('end', function(){
            response.end();
        });
    });
    req.on('error', function(err){
        console.log('error:', err);
    });
    req.end();

}

http.createServer(handleRequest).listen(8080);