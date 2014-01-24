'use strict';

var fs = require('fs');
var path = require('path');
var execFile = require('child_process').execFile;
var assert = require('assert');
var pkg = require('../package.json');

describe('trivials', function () {
  it('should return the version', function (cb) {
    var cp = execFile('node', [path.join(__dirname, '../', pkg.bin.mqttbot), '-v']);
    var expected = pkg.name + ' ' + pkg.version;

    cp.stdout.on('data', function (data) {
      assert.equal(data.replace(/\r\n|\n/g, ''), expected);
      cb();
    });
  });
});
