var log = require('logger')('autos');
var clustor = require('clustor');

var self = '*.autos.serandives.com';
var port = 4004;

clustor(function () {
    var fs = require('fs');
    var http = require('http');
    var express = require('express');
    var favicon = require('serve-favicon');
    var bodyParser = require('body-parser');
    var builder = require('component-middleware');
    var agent = require('hub-agent');
    var proxy = require('proxy');
    var procevent = require('procevent')(process);

    var index = fs.readFileSync(__dirname + '/public/index.html', 'utf-8');

    var app = express();

    app.use(favicon(__dirname + '/public/images/favicon.ico'));

    app.use('/public', express.static(__dirname + '/public'));

    app.use(proxy);

    app.use(builder({
        path: '/build/build'
    }));

    //index page
    app.all('*', function (req, res) {
        //TODO: check caching headers
        res.set('Content-Type', 'text/html').status(200).send(index);
    });

    var server = http.createServer(app);
    server.listen(port);

    agent('/drones', function (err, io) {
        proxy.listen(self, io);
        procevent.emit('started');
    });

}, function (err, address) {
    log.info('drone started | domain:%s, address:%s, port:%s', self, address.address, address.port);
});

process.on('uncaughtException', function (err) {
    log.fatal('unhandled exception %s', err);
    log.trace(err.stack);
});
