# mqttbot [![Build Status](https://secure.travis-ci.org/cresprit/mqttbot.png?branch=master)](https://travis-ci.org/cresprit/mqttbot) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

MQTT bot for broker testing on CLI

# HOW TO USE

```
# localhost

~ mqttbot -b 5 -t test mqtt://localhost

# CloudMQTT

~ mqttbot -b 10 -t test mqtt://username:passwd@mx.cloudmqtt.com:18629

# Using WebSocket

~ mqttbot -b 2 -t test ws://localhost:8080/mqtt
~ mqttbot -b 2 -t test ws://broker.mqttdashboard.com:8000/mqtt

# Timer interval option

~ mqttbot -b 1 -t test -i 1000 mqtt://localhost

# Prompt option

~ mqttbot -b 1 -t test -p mqtt://localhost
bot:0> connect to mqtt://localhost
bot:0> subscribe to test
bot:1> connect to mqtt://localhost
bot:1> subscribe to test
bot:0> waiting for connection
bot:0> has a connection
> it's for testing
bot:0> is sending it's for testing at 1390851918570
bot:0> got message(1/2) it's for testing at 1390851918570
bot:1> got message(2/2) it's for testing at 1390851918570
> waiting for message
```

## Options

- `-t,  --topic [string]` topic to publish on
- `-b,  --bot [int]` number of bots
- `-i,  --interval [int]` timer interval in ms between publications
- `-p,  --prompt` interactive prompt, without timer
- `-v,  --version` display the version
- `-h,  --help` print this help

## License

[MIT license](http://opensource.org/licenses/MIT)
