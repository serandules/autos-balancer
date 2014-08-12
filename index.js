var fs = require('fs');
var build = require('build');
var http = require('http');
var express = require('express');
var agent = require('hub-agent');

var PORT = 4002;
var app = express();

var index = fs.readFileSync('./public/index.html', 'utf-8');

app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use('/public', express.static(__dirname + '/public'));

//proxying requests
app.use(agent.proxy());

//hot building component
app.use(build);

//index page
app.all('*', function (req, res) {
    //TODO: check caching headers
    res.set('Content-Type', 'text/html').send(200, index);
});

agent(http.createServer(app));