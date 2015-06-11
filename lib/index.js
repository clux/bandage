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
    });
  };
  return tape(name, wrapped);
};

var tapeRunNoErrors = function (name, fn) {
  var wrapped = function (t) {
    co(function *() {
      yield fn(t);
      t.end();
    }).catch(function (e) {
      throw e;
    });
  };
};

var verifyGenerator = function (name, fn) {
  if (!fn || fn.constructor.name !== 'GeneratorFunction') {
    throw new Error('All tests must be generator functions ("' + name + '")');
  }
};


exports = module.exports = function (name, fn) {
  verifyGenerator(name, fn);
  return tapeRun(name, fn);
};

exports.testRaw = function (name, fn) {
  verifyGenerator(name, fn);
  return tapeRunNoErrors(name, fn);
};
