#!/usr/bin/env node

'use strict';

var nopt = require('nopt');
var path = require('path');
var fs = require('fs');
var url = require('url');
var pkg = require('./package.json');
var _ = require('lodash');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var mqtt = require('mqtt');
var Stream = require('stream').Stream;
var opts = nopt({
  topic: [String],
  bot: [Stream, Number],
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

  validated = (opts.url && (opts.url.hostname || opts.url.pathname))
              && (opts.bot > 0 && opts.topic);

  if (opts.version) {
    return console.log(pkg.name, pkg.version);
  }

  if (opts.help || !validated) {
    return console.log([
      pkg.name + ' ' + pkg.version,
      'Usage: mqttbot [OPTION]... [USERNAME:PASSWORD]@[URL]...\n',
      'Startup:',
      '\t-t,  --topic             String, topic for publish',
      '\t-b,  --bot               Number, count for bot',
      '\t-v,  --version           display the version of Wget and exit.',
      '\t-h,  --help              print this help.'
    ].join('\n'));
  }

  cb();
}

function mqttbot(opts) {
  var mqttopts = {keepalive: 10000};
  var port = opts.url.port || 1883;
  var host = opts.url.hostname || opts.url.pathname;

  this.opts = _.cloneDeep(opts);

  if (opts.url.auth) {
    var account = opts.url.auth.split(':');
    mqttopts.username = account[0];
    mqttopts.password = account[1];
  }

  this.log('connect to', opts.url.href);
  this.client = mqtt.createClient(port, host, mqttopts);

  this.log('subscribe to', this.opts.topic);
  this.client.subscribe(opts.topic);

  this.client.on('message', this.emit.bind(this, 'message'));
}

util.inherits(mqttbot, EventEmitter);

mqttbot.prototype.log = function () {
  var args = [].slice.call(arguments);
  args.unshift('bot:' + this.opts.botid + '>');
  console.log.apply(console, args);
};

mqttbot.prototype.pub = function (message) {
  this.log('is sending', message);
  this.client.publish(this.opts.topic, message);
};

mqttbot.prototype.stop = function () {
  this.client.end();
};

prepare(function () {
  var botCount = opts.bot || 0;
  var bots = [];

  var randomBotid = function () {
    var min = 0, max = opts.bot - 1;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var sendMessage = function () {
    var bot = bots[randomBotid()];
    bot.pub(['`from bot', bot.opts.botid, '` at', Date.now()].join(' '));
  };

  var onMessage = function (bot) {
    return function (topic, message) {
      bot.log('got message', message);
    };
  };

  while (botCount--) {
    var bot = new mqttbot({
      botid: botCount,
      url: opts.url,
      topic: opts.topic
    });

    bot.on('message', onMessage(bot));
    bots.push(bot);
  }

  setInterval(function () {
    sendMessage();
  }, 2000);
});
