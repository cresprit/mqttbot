# mqttbot [![Build Status](https://secure.travis-ci.org/cresprit/mqtt.png?branch=master)](https://travis-ci.org/cresprit/mqttbot)

MQTT bot for broker testing on CLI

# USESE

## LOCALHOST

    mqttbot -b 5 -t test mqtt://localhost

## CLOUDMQTT

    mqttbot -b 10 -t test mqtt://username:passwd@mx.cloudmqtt.com:18629

## VAI WEBSOCKET

WARNING: Some of public broker(`m2m.eclipse.org`, `test.mosquitto.org`) reject a ws connection from mqttbot with an error 404 or 403. We've tested with `broker.mqttdashboard.com` on our side it work well.

    mqttbot -b 2 -t test ws://localhost:8080/mqtt
    mqttbot -b 2 -t test ws://broker.mqttdashboard.com:8000/mqtt

## Options

- `-t,  --topic` String, topic for publish,
- `-b,  --bot` Number, count for bot,
- `-v,  --version `display the version,
- `-h,  --help `print this help.

## License

[MIT license](http://opensource.org/licenses/MIT)
