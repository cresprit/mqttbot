#!/usr/bin/env node

'use strict';

var nopt = require('nopt');
var path = require('path');
var fs = require('fs');
var url = require('url');
var pkg = require('../package.json');
var _ = require('lodash');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var mqtt = require('mqtt');
var mows = require('mows');
var Readline = require('readline');
var Stream = require('stream').Stream;

var opts = nopt({
  topic: [String],
  bot: [Stream, Number],
  interval: [Stream, Number],
  clientId: [String],
  prompt: Boolean,
  random: [String],
  help: Boolean,
  version: Boolean
}, {
  h: '--help',
  v: '--version'
});

function prepare(cb) {
  var validated = false;

  if (opts.argv.remain.length > 0) {
    opts.url = url.parse(opts.argv.remain[0]);
  }

  validated = (opts.url && (opts.url.hostname || opts.url.pathname)) && (opts.bot > 0 && opts.topic);

  if (opts.version) {
    return console.log(pkg.name, pkg.version);
  }

  if (opts.help || !validated) {
    return console.log([
      pkg.name + ' ' + pkg.version,
      'Usage: mqttbot [OPTIONS]... [USERNAME:PASSWORD]@[URL]...\n',
      'Examples:',
      '\tmqttbot -b 2 -t test ws://localhost:8080/mqtt',
      '\tmqttbot -b 10 -t test mqtt://username:passwd@mx.cloudmqtt.com:18629\n',
      '\tmqttbot -b 2 -t test -r 0 100 ws://localhost:8080/mqtt',
      'Startup:',
      '\t-t,  --topic [string]      topic to publish on',
      '\t-b,  --bot [int]           number of bots',
      '\t-c,  --client [string]     a clientid/prefix',
      '\t-i,  --interval [int]      timer interval in ms between publications',
      '\t-p,  --prompt              interactive prompt, without timer',
      '\t-r,  --random [min]-[max]  random number message',
      '\t-v,  --version             display the version',
      '\t-h,  --help                print this help.'
    ].join('\n'));
  }

  cb();
}

function mqttbot(opts) {
  var mqttopts = {
    keepalive: 10000,
    clientId: opts.clientId || undefined
  };
  var port = opts.url.port || 1883;
  var host = opts.url.hostname || opts.url.pathname;

  this.opts = _.cloneDeep(opts);

  if (opts.url.auth) {
    var account = opts.url.auth.split(':');
    mqttopts.username = account[0];
    mqttopts.password = account[1];
  }

  this.log('connect to', opts.url.href);

  if (opts.url.protocol === "mqtt:") {
    console.log(mqttopts);
    this.client = mqtt.createClient(port, host, mqttopts);
  } else if (opts.url.protocol === "ws:") {
    this.client = mows.createClient('ws://' + host + ':' + port, mqttopts);
  } else {
    throw new Error("Unknown protocol for an MQTT broker, expected mqtt or ws URI");
  }

  this.client.on('message', this.emit.bind(this, 'message'));
  this.client.on('connect', this.emit.bind(this, 'connect'));
  this.client.on('disconnect', this.emit.bind(this, 'disconnect'));
  this.client.on('close', this.emit.bind(this, 'close'));
  this.client.on('error', this.emit.bind(this, 'error'));

  this.log('subscribe to', this.opts.topic);
  this.client.subscribe(opts.topic);
}

util.inherits(mqttbot, EventEmitter);

mqttbot.prototype.log = function() {
  var args = [].slice.call(arguments);
  args.unshift('bot:' + this.opts.botid + '>');
  console.log.apply(console, args);
};

mqttbot.prototype.pub = function(message) {
  this.log('is sending', message);
  this.client.publish(this.opts.topic, message);
};

mqttbot.prototype.stop = function() {
  this.client.end();
};

prepare(function() {
  var interval = opts.interval || 2000;
  var botCount = opts.bot || 0;
  var recvCount = 0;
  var bots = [];
  var readline;
  var randomNumbericMessage = function() {
    var range = opts.random.split('-');
    var min = parseInt(range[0], 10);
    var max = parseInt(range[1], 10);
    return (Math.random() * (max - min + 1) + min).toString();
  }

  var randomBotid = function() {
    var min = 0,
      max = opts.bot - 1;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var sendMessage = function(message) {
    var bot = bots[randomBotid()];
    if (!message) {
      message = opts.random ? randomNumbericMessage() : ['`from bot', bot.opts.botid, '` at', Date.now()].join(' ');
    }
    bot.pub(message);
  };

  var showPrompt = function() {
    readline.question("> ", function(answer) {
      sendMessage(answer + ' at ' + Date.now());
    });
  };

  var onMessage = function(bot) {
    return function(topic, message) {
      bot.log('got message(' + ++recvCount + '/' + botCount + ')', message);
      if (recvCount === botCount) {
        recvCount = 0;
        if (opts.prompt) {
          showPrompt();
        }
      }
    };
  };

  for (var i = 0; i < botCount; ++i) {
    var bot = new mqttbot({
      botid: i,
      url: opts.url,
      topic: opts.topic,
      clientId: opts.clientId + '-' + i
    });

    bot.on('message', onMessage(bot));
    bots.push(bot);
  }

  bots[0].log('waiting for connection');

  bots[0].on('error', function(err) {
    bots[0].log('got an error', err);
  });

  bots[0].on('connect', function() {
    bots[0].log('connected to', opts.url.host);

    if (!opts.prompt) {
      setInterval(sendMessage, interval);
    } else {
      readline = Readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      showPrompt();
    }
  });
});
