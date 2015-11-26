'use strict';

let Test = require('./test');
let tap = require('./tap');
let co = require('co');

let tests = [];

let test = function (name, opts, fn) {
  tests.push(new Test(name, opts, fn));
};

test.run = function (testIndices, cb) {
  return co(function *() {
    console.log('TAP version 13');

    let count = 0;
    let pass  = 0;

    let report = function (results) {
      results.forEach(x => {

        count += 1;
        pass  += x.ok ? 1 : 0;

        console.log(tap(x, count));

        if (x.operator === 'test')
          report(x.results);
      });
    };

    var planned = testIndices && testIndices.length ?
      testIndices.map(i => tests[i]).filter(i => i) :
      tests ;

    for (let test of planned) {
      let result = yield test.run();
      console.log('# ' + result.msg);
      report(result.results);
    }

    console.log();
    console.log('1..' + count);
    console.log('# tests ' + count);
    console.log('# pass  ' + pass);
    console.log('# fail  ' + (count - pass));
    cb(Number(!!(count - pass)));

  }).catch(function (err) {
    console.log('Bail out!'); // Should not happen
    console.error(err instanceof Error ? err.stack : err);
    cb(1);
  });
};

test.Test = Test;

module.exports = test;
