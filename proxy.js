"use strict";
var nodent = require('nodent')();
var http = require('http');
var urlLib = require('url');


class HttpResponse {
	constructor(response){
		var self = this;
		this.response = response;
		this._readable = null;
		this._end = false;
		this.response.on('end', function(){
			self._end = true;
		});
		this.response.on('readable', function(){
			if(self._readable){
				self._readable();
			}
		});
	}

	async read(){
		if(this._end){
			return null;
		}
		var chunk = this.response.read();
		if(chunk){
			return chunk;
		}
		var self = this;
		self._readable = function(){
			self._readable = null;
			async return self.response.read();
		}
	}
}

async function request(options){
	var req = http.request(options, function(res){
		async return new HttpResponse(res);
	});
	req.on('error', function(err){
		async throw err;
	});
	req.end();
}

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

//http.createServer(handleRequest).listen(8080);


var options = {
	hostname: 'qqqq.lenta.ru',
	port: 80,
	path: '/',
	method: 'GET'
};

try{
	var resp = await request(options);
	var chunk;
	while(null != (chunk = await resp.read()))
	{
		console.log('.');
	}
}
catch(err){
	console.error('request error:', err);
}
