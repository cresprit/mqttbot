# mqttbot [![Build Status](https://secure.travis-ci.org/cresprit/mqttbot.png?branch=master)](https://travis-ci.org/cresprit/mqttbot) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

MQTT bot for broker testing on CLI

# HOW TO USE

```
# Localhost

~ mqttbot -b 5 -t test mqtt://localhost

# Cloudmqtt

~ mqttbot -b 10 -t test mqtt://username:passwd@mx.cloudmqtt.com:18629

# Using websocket
# WARN: Some of public broker(`m2m.eclipse.org`, `test.mosquitto.org`) 
# was rejects ws connection from mqttbot with an error 404 or 403. 
# We've tested with `broker.mqttdashboard.com` on our side it works well.

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
bot:0> waitting for connection
bot:0> has a connection
> it's for testing
bot:0> is sending it's for testing at 1390851918570
bot:0> got message(1/2) it's for testing at 1390851918570
bot:1> got message(2/2) it's for testing at 1390851918570
> waiting for message
```

## Options

- `-t,  --topic` String, topic for publish
- `-b,  --bot` Number, count for bot
- `-i,  --interval` Number, timer interval (milli) for publish
- `-p,  --prompt` using the prompt for publish without timer
- `-v,  --version `display the version
- `-h,  --help `print this help

## License

[MIT license](http://opensource.org/licenses/MIT)
