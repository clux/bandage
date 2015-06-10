var tape = require('tape');
var co = require('co');
//var cs = require('co-stream');

var tapeRun = function (name, fn) {
  var wrapped = function (t) {
    co(function *() {
      yield fn(t);
      t.end();
    }).catch(function (err) {
      // handle errors from fn, and maintain tape's error formatting
      t.error(err, err.message);
      throw err;
    });
  };
  // wait for the tape stream to end
  //return cs.wait(tape.test(name, wrapped));

  // appears you can just yield a stream
  return tape(name, wrapped);
};

var test = function (name, fn) {
  if (!fn || fn.constructor.name !== 'GeneratorFunction') {
    throw new Error('All tests must be generator functions ("' + name + '")');
  }
  return tapeRun(name, fn);
};

module.exports = test;
