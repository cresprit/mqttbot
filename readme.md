# mqttbot [![Build Status](https://secure.travis-ci.org/cresprit/mqtt.png?branch=master)](https://travis-ci.org/cresprit/mqttbot)

MQTT bot for borker testing

# USESE

## LOCALHOST

    mqttbot -b 5 -t dev mqtt://localhost

## CLOUDMQTT

    mqttbot -b 10 -t test2 mqtt://username:passwd@mx.cloudmqtt.com:18629

## Options

- `-t,  --topic` String, topic for publish',
- `-b,  --bot` Number, count for bot',
- `-v,  --version `display the version of Wget and exit.',
- `-h,  --help `print this help.

## License

[MIT license](http://opensource.org/licenses/MIT)
