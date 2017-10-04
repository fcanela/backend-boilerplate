'use strict';


const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);


const serverPromise = require('../../../src/app');
let server;

function Client(opts={}) {
  this.parseBuffer = !!opts.buffer;
}

const proto = Client.prototype;

function binaryParser(res, callback) {
  res.setEncoding('binary');
  let data = '';
  res.on('data', function(chunk) {
    data += chunk;
  });
  res.on('end', function() {
    callback(null, new Buffer(data, 'binary'));
  });
}

proto.request = async function request(method, path, body) {
  try {
    if (!server) server = await serverPromise;

    let req = chai.request(server);
    req = req[method](path);

    if (this.parseBuffer) req = req.buffer().parse(binaryParser);

    if (body) req.send(body);

    const response = await req;
    return response;
  } catch (err) {
    // Chai throws non 200 replies as error
    if (err.status) return err;
    throw err;
  }
};

proto.get = function get(path) {
  return this.request('get', path);
};

proto.post = function post(path, body) {
  return this.request('post', path, body);
};

proto.put = function put(path, body) {
  return this.request('put', path, body);
};

proto.delete = function del(path) {
  return this.request('delete', path);
};

proto.patch = function patch(path, body) {
  return this.request('patch', path, body);
};

module.exports = Client;
