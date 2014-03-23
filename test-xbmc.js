var Xbmc = require('xbmc'),
    connection = new Xbmc.TCPConnection({
      host: 'mediapc',
      port: 9090,
      verbose: true
    }),
    xbmcApi = new Xbmc.XbmcApi;

  xbmcApi.setConnection(connection);

  xbmcApi.on('connection:data', function(data)  {
    console.log('onData:', data);
  });
  xbmcApi.on('connection:open', function()  {
    console.log('onOpen');
    //Player.GetActivePlayers
    xbmcApi.input.Back();
    setTimeout(function() {xbmcApi.disconnect();}, 5000);
  });
  xbmcApi.on('connection:close', function() {
    console.log('onClose');
    process.exit();
  });
