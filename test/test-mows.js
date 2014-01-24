var mows   = require('mows')
  , client = mows.createClient('ws://m2m.eclipse.org:80');

client.subscribe('presence');
client.publish('presence', 'Hello mqtt');

client.on('message', function (topic, message) {
  console.log(message);

  client.end();
});