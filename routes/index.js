var fs = require('fs'),
    path = require('path'),
    handlebars = require('handlebars'),
    Swag = require('swag'),
    shef = require('shef'),
    box1 = shef.box({host:'directv-hr20-1.mattandmeg.int'}),
    Onkyo = require("onkyo"),
    onkyo = Onkyo.init(),
    Xbmc = require('xbmc'),
    connection = new Xbmc.TCPConnection({
      host: 'mediapc.mattandmeg.int',
      port: 9090,
      verbose: true,
      silent: true
    }),
    xbmcApi = new Xbmc.XbmcApi(),
    initXbmc = function() {
      xbmcApi.setConnection(connection);
    },
    discoverOnkyo = function() {
      onkyo.Discover(function(err, device) {
          onkyo.Connect(function() {

          });
      });
    },
    lirc_node = require('lirc_node');

lirc_node.init();
initXbmc();
discoverOnkyo();

onkyo.on("error", function(err){
    console.log(err);
});
onkyo.on("detected", function(device){
    console.log(device);
});
onkyo.on("connected", function(host){
    console.log("connected to: "+JSON.stringify(host));
});



xbmcApi.on('connection:data', function(data)  {
  console.log('onData:', data);
});
xbmcApi.on('connection:open', function(data)  {
  console.log('onOpen:', data);
});
xbmcApi.on('connection:close', function(data) {
  console.log('onClose:', data);
  initXbmc();
});

exports.index = function(req, res) {
  fs.readFile(__dirname + '/../public/index.html', 'utf8', function(error, content) {
    if (error) { console.log(error); }
    //var prefix = (opts.configs.get("prefix")) ? opts.configs.get("prefix") : "";
    var pageBuilder = handlebars.compile(content),
        html = pageBuilder({});

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(html, 'utf-8');
    res.end('\n');
  });
};

exports.config = function(req, res) {
  var data = {"history":[]};
  sendJSON(res, data);
};


exports.actions = function(req, res) {
  console.log(req.body);
  var action = req.body.action.split("."),
      value  = req.body.value,
      sendBack = function(data) {
        sendJSON(res,data);
      };
  console.log('Action', req.body.action);
  if (action[0] == "directv") {
    console.log("directv");
    actionDirectv(action[1], value, sendBack);
  } else if (action[0] == "onkyo") {
    actionOnkyo(action[1], value, sendBack);
  }
};

exports.discover = function(req, res) {
  onkyo.Discover(function(err, device) {
      onkyo.Connect(function() {

      });
  });
};

exports.power = function(req, res) {
  console.log("power request");
  var onkyoResponse = false,
      profile = req.body.profile,
      value = req.body.value,
      sendBack = function(data) {
        //console.log(data);
        sendJSON(res,data);
      };
  if (value == "off") {
    lirc_node.irsend.send_once("vizio", "PowerOff", function() {
      console.log("lirc vizio powered off");
    });
    onkyo.PwrOff(function(error, data){
      if (!onkyoResponse) {
        onkyoResponse = true;
        console.log(data);
        sendBack({"power": false, "response": data, "success": true});
      }
    });
  } else {
    lirc_node.irsend.send_once("vizio", "PowerOn", function() {
      console.log("lirc vizio powered on");
    });
    onkyo.PwrOn(function(error, data){
      if (!onkyoResponse) {
        onkyoResponse = true;
        console.log(data);
        sendBack({"power": true, "response": data, "success": true});
      }
    });
  }
};

exports.macros = function(req, res) {
  console.log(req.body);
  var source,
      sendBack = function(data) {
        //console.log(data);
        sendJSON(res,data);
      };
  if (req.body.profile == "sat") {
    source = "VIDEO2";
  } else if (req.body.profile == "xbmc") {
    source = "PC";
  } else if (req.body.profile == "wii") {
    source = "GAME";
  }
  actionOnkyo("SetSource", source, sendBack);
};

var sendJSON = function(res, data) {
  res.setHeader('Cache-Control', 'max-age=0, must-revalidate, no-cache, no-store');
  res.writeHead(200, { 'Content-type': 'application/json' });
  res.write(JSON.stringify(data), 'utf-8');
  res.end('\n');
};

var actionDirectv = function(action, value, callback) {
  if (action == "keypress") {
    box1.key(value).press(function(err, response) {
      if(!err) console.log('Sent keypress', value);
      var data = {
            "keypress": value,
            "response": response,
            "success": true
          };
      callback(data);
    });
  }
};

var actionOnkyo = function(action, value, callback) {
  console.log("onkyo:", action, value, typeof onkyo[action]);
  if (typeof onkyo[action] == "function") {
    console.log("function confirmed");
    if (value !== '') {
      onkyo[action](value, function(err, response) {
        if(!err) console.log(action, value);
        var data = {
              "action": action,
              "value": value,
              "response": response,
              "success": true
            };
        callback(data);
      });
    } else {
      onkyo[action](function(err, response) {
        if(!err) console.log(action, value);
        var data = {
              "action": action,
              "value": value,
              "response": response,
              "success": true
            };
        callback(data);
      });
    }
  }
};
