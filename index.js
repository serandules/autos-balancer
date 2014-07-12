var fs = require('fs');
var build = require('build');
var express = require('express');
var proxy = require('proxy');

var PORT = 4000;
var app = express();

var allow = {
    'accounts.serandives.com': 4000,
    'auto.serandives.com': 4000,
    'localhost': 4000
};
proxy = proxy(allow);

var index = fs.readFileSync('./public/index.html', 'utf-8');

app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use('/public', express.static(__dirname + '/public'));
app.use(proxy);

var env = process.env.NODE_ENV;
if (env !== 'production') {
    app.use(build);
}

/**
 * GET index page.
 */
app.all('*', function (req, res) {
    //TODO: check caching headers
    res.set('Content-Type', 'text/html').send(200, index);
});

app.listen(PORT);
console.log('listening on port ' + PORT);