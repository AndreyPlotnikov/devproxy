'use strict';
var stream = require('stream');
var http = require('http');
var urlLib = require('url');
var _ = require('lodash');
var Promise = require('bluebird');

class StringIO extends stream.Readable {
  constructor(value) {
    super();
    this._value = value;
  }

  _read() {
    this.push(this._value);
    this.push(null);
  }
}

class ProxyRequest {
  constructor(request) {
    this.headers = _.cloneDeep(request.headers);
    this.method = request.method;
    this.url = request.url;
    this.body = request;
  }
}

class ProxyResponse {
  constructor() {
    this.statusCode = 200;
    this.headers = {};
    this.setBodyAsString('');
  }

  setBodyAsString(body) {
    this.body = new StringIO(body);
  }
}

class RequestContext {
  constructor(request) {
    this.request = new ProxyRequest(request);
    this.response = new ProxyResponse();
  }
}

function getPipeline(request) {
  return {
    execute: (context) => {
      return new Promise((resolve, reject) => {
        let request = context.request;
        let parsedUrl = urlLib.parse(request.url);
        let options = {
          hostname: 'lenta.ru',
          port: 80,
          path: parsedUrl.href,
          method: request.method,
        };
        var req = http.request(options, (res) => {
          context.response.statusCode = res.statusCode;
          context.response.headers = res.headers;
          context.response.body = res;
          //context.response.setBodyAsString('Hello');
          console.log('status code:', res.statusCode);
          console.log('headers:', res.headers);
          resolve(context);
        });

        req.on('error', function (err) {
          console.log('error:', err);
          reject(err);
        });

        req.end();
      });
    },
  };
}

function handleRequest(request, response) {
  let context = new RequestContext(request);
  let pipeline = getPipeline(request);
  pipeline.execute(context).then((context) => {
    let proxyRsp = context.response;
    response.writeHead(proxyRsp.statusCode, proxyRsp.headers);
    proxyRsp.body.pipe(response);
  });
}

http.createServer(handleRequest).listen(8080);
