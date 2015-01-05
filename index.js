var debug = require('debug')('serandules-autos');
var fs = require('fs');
var http = require('http');
var express = require('express');
var agent = require('hub-agent');

var HTTP_PORT = 4004;

var dev = process.env.NODE_ENV === 'development';

var app = express();

var index = fs.readFileSync(__dirname + '/public/index.html', 'utf-8');

app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use('/public', express.static(__dirname + '/public'));

//proxying requests
app.use(agent.proxy());

//hot building component
app.use(require('build'));

//index page
app.all('*', function (req, res) {
    //TODO: check caching headers
    res.set('Content-Type', 'text/html').send(200, index);
});

//error handling
app.use(agent.error);

agent(http.createServer(app), HTTP_PORT);

process.on('uncaughtException', function (err) {
    debug('unhandled exception ' + err);
    debug(err.stack);
});

/*
setTimeout(function () {
    agent.config('ruchira', function (data) {
        debug(data);
    });
}, 0);*/
