var WebSocket = require('ws');
var ws = new WebSocket('ws://test.mosquitto.org/mqtt', {
  protocolVersion: 13, origin: 'http://websocket.org'
});
ws.on('open', function(error) {
  console.log('opened', error);
});

ws.on('error', function(err) {
  console.log('error', err);
});

ws.on('message', function(data, flags) {
    // flags.binary will be set if a binary data is received
    // flags.masked will be set if the data was masked
});