var shef = require('shef'),
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
  var profile = req.body.profile,
      value  = req.body.value,
      sendBack = function(data) {
        sendJSON(res,data);
      };
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
  if (typeof onkyo[action] == "function") {
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
