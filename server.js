var express = require('express.io'),
    http = require('http'),
    sysPath = require('path'),
    slashes = require('connect-slashes'),
    nconf = require('nconf'),
    routes = require("./routes");


// Specify default options.
if (process.argv[2]) {
    if (fs.lstatSync(process.argv[2])) {
        configFile = require(process.argv[2]);
    } else {
        configFile = process.cwd() + 'config.js';
    }
} else {
    configFile = process.cwd()+'config.js';
}

config = nconf
          .argv()
          .env("__")
          .file({ file: configFile });


var app = express();


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

// Configuration
var oneDay = 86400000,
    cookieParser = express.cookieParser();
app.configure(function(){
    if ("log" in config) {
        app.use(express.logger({stream: access_logfile }));
    }
    app.use(cookieParser);
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    //app.use('/bootstrap', express.static(__dirname + '/public/bootstrap'));
    app.use('/css', express.static(__dirname + '/public/stylesheets', { maxAge: oneDay }));
    app.use('/js', express.static(__dirname + '/public/javascripts', { maxAge: oneDay }));
    app.use('/images', express.static(__dirname + '/public/images', { maxAge: oneDay }));
    app.use('/img', express.static(__dirname + '/public/images', { maxAge: oneDay }));
    app.use('/fonts', express.static(__dirname + '/public/fonts', { maxAge: oneDay }));
    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Redirect requests that include a trailing slash.
if (config.get('stripSlashes')) {
  app.use(slashes(false));
}

/*  ==============================================================
    Serve the site skeleton HTML to start the app
=============================================================== */

var port = (config.get("port")) ? config.get("port") : 3001;
if ("ssl" in config) {
    var server = app.https(opts).io();
} else {
    var server = app.http().io();
}

/*  ==============================================================
    Routes
=============================================================== */

app.post('/api/action', routes.actions);
//app.get('/api/tune/:channel', routes.tuneChannel);
app.get('/api/onkyo/discover', routes.discover);

/*  ==============================================================
    Launch the server
=============================================================== */

server.listen(port);
console.log("Express server listening on port %d", port);
