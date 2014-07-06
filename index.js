var fs = require('fs');
//var process = require('process');
var build = require('build');
var express = require('express');
var app = module.exports = express();

var index = fs.readFileSync('./public/index.html', 'utf-8');

app.use(express.favicon(__dirname + '/public/images/favicon.ico'));

app.use('/public', express.static(__dirname + '/public'));

var env = process.env.NODE_ENV;
if (env !== 'production') {
    app.use(build);
}

/**
 * GET index page.
 */
app.use('*', function (req, res) {
    //TODO: check caching headers
    res.set('Content-Type', 'text/html').send(200, index);
});

app.listen(2000);
console.log('listening on port 2000');