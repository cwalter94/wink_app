/**
 * Module dependencies.
 */

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var connectAssets = require('connect-assets');
/**
 * API keys and Passport configuration.
 */

var secrets = require('./config/secrets');

/**
 * Create Express server.
 */

var app = express();
app.set('env', process.env.ENV || 'development');
var server = require('http').createServer(app);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(connectAssets({
    paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')],
    helperContext: app.locals
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

/**
 * Main routes.
 */

app.get('/partials/outer/:name', function(req, res) {
    res.render('partials/outerState/' + req.params.name);
});

app.get('/partials/inner/:dir/:name', function(req, res) {
    res.render('partials/innerState/' + req.params.dir + '/' + req.params.name);
});

app.get("*", function(req, res) {
    res.render('index', {CDN: process.env.CDN || false, MIN: process.env.MIN || false});
});

/**
 * 500 Error Handler.
 */


/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});



module.exports = app;
