'use strict';

let Test = require('./test');
let tap = require('./tap');
let co = require('co');
var log = console.log;

let tests = [];
let test = function (name, opts, fn) {
  let t = new Test(name, opts, fn);
  tests.push({ test: t, name: t._name });
};

test.run = function (testIndices, cb) {
  return co(function *() {
    log('TAP version 13');

    let count = 0;
    let pass  = 0;

    const report = function (results) {
      results.forEach(x => {
        count += 1;
        pass  += x.ok ? 1 : 0;

        log(tap(x, count));

        if (x.operator === 'test') {
          report(x.results);
        }
      });
    };

    var planned = testIndices && testIndices.length ?
      testIndices.map(i => tests[i]).filter(i => i) :
      tests;

    for (const current of planned) {
      const t = current.test;
      log('# ' + current.name);
      const result = yield t.run();
      report(result.results);
    }

    log('');
    log('1..' + count);
    log('# tests ' + count);
    log('# pass  ' + pass);
    if (count > pass) {
      log('# fail  ' + (count - pass));
    }
    // flush buffer before returning
    process.stdout.write('', function () {
      var res = Number(count > pass);
      cb(res);
    });
  }).catch(function (err) {
    console.log('Bail out!'); // Should not happen
    console.error(err instanceof Error ? err.stack : err);
    cb(1);
  });
};

test.Test = Test;

module.exports = test;
