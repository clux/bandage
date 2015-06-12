var tape = require('tape');
var co = require('co');
var assert = require('assert');

var coWrap = function (fn) {
  return function tapeCoWrap(t) {
    co(function* () {
      yield* fn(t);
      t.end();
    }).catch(function (err) {
      // handle errors from fn, and maintain tape's error formatting
      t.error(err, err.message);
    });
  };
};

var plainWrap = function (fn) {
  return function tapeTryWrap(t) {
    try {
      fn(t);
      t.end();
    }
    catch (err) {
      t.error(err, err.message);
    }
  };
};

var test = function (name, fn) {
  assert(typeof fn === 'function', 'Test function not defined');
  if (fn.constructor.name === 'GeneratorFunction') {
    return tape(name, coWrap(fn));
  }
  else {
    return tape(name, plainWrap(fn));
  }
};

module.exports = test;
