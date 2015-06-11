var tape = require('tape');
var co = require('co');
var assert = require('assert');

var tapeRun = function (name, fn) {
  var wrapped = function (t) {
    co(function* () {
      yield* fn(t);
      t.end();
    }).catch(function (err) {
      // handle errors from fn, and maintain tape's error formatting
      t.error(err, err.message);
    });
  };
  return tape(name, wrapped);
};

var verifyGenerator = function (name, fn) {
  assert(fn && fn.constructor.name === 'GeneratorFunction',
    'Test function "' + name + '" must be a generator function'
  );
};
var test = function (name, fn) {
  verifyGenerator(name, fn);
  return tapeRun(name, fn);
};

module.exports = test;
