var fs = require('fs');
var build = require('build');
var express = require('express');
var proxy = require('proxy');

var PORT = 4002;
var app = express();

var allow = {
    'accounts.serandives.com': 4004,
    'auto.serandives.com': 4004,
    'localhost': 4004
};
proxy = proxy(allow);

var index = fs.readFileSync('./public/index.html', 'utf-8');

app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use('/public', express.static(__dirname + '/public'));

//proxying requests
app.use(proxy);

//hot building component
app.use(build);

//index page
app.all('*', function (req, res) {
    //TODO: check caching headers
    res.set('Content-Type', 'text/html').send(200, index);
});

app.listen(PORT);
console.log('listening on port ' + PORT);