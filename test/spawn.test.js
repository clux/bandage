var test = require('../');
var exec = require('child_process').exec;

var runbndg = function (name) {
  return new Promise(function (resolve) {
    exec('./bin.js test/' + name + '.js', function (err, stdout, stderr) {
      resolve({
        err: err,
        tap: stdout.split('\n')
      });
    });
  });
};

test('promise test', function *(t) {
  var res = yield runbndg('promise.spawn');
  var expected = [
    'TAP version 13',
    '# promise failure',
    'not ok 1 reject error',
    '  ---',
    '    operator: error',
    '    expected: undefined',
    '    actual:   [Error: reject error]',
    '    stack:',
    '      Error: reject error',
    '        at null._onTimeout (./bandage/test/promise.test.js:6:14)',
    '        at Timer.listOnTimeout (timers.js:89:15)',
    '  ...',
    'not ok 2 test exited without ending',
    '  ---',
    '    operator: fail',
    '  ...',
    '',
    '1..2',
    '# tests 2',
    '# pass  0',
    '# fail  2',
  ];
  t.equal('    actual:   [Error: reject error]', expected[6], 'counting 1');
  t.equal(expected[6], res.tap[6], 'actual error line present');
  t.equal('not ok 2 test exited without ending', expected[12], 'counting 2');
  t.equal(expected[12], res.tap[12], 'not ok 2 line present');
  var tap = res.tap;
});

test('basic test', function *(t) {
  var res = yield runbndg('basic.test');
  var expected = [
    'TAP version 13',
    '# setup',
    'ok 1 asserting in setup',
    'ok 2 could yield in setup',
    '# block',
    'ok 3 waited for slow',
    'ok 4 next test has not started yet',
    '# basic',
    'ok 5 can use ok',
    'ok 6 can use equal',
    'ok 7 heyo',
    'ok 8 can read setup state',
    '# tests',
    'ok 9 asserting in teardown',
    'ok 10 state set through setup',
    '',
    '1..10',
    '# tests 10',
    '# pass  10',
    '',
    '# ok',
    '',
    ''
  ];
  var tap = res.tap;
  t.equal(tap.indexOf('# tests 10'), 17, '10 tests');
  t.equal(tap.indexOf('# pass  10'), 18, '10 passes');
  t.equal(tap.indexOf('# ok'), 20, 'output ok');
});

test('catch test', function *(t) {
  var res = yield runbndg('catch.test');
  var expected = [
    'TAP version 13',
    '# throw is caught',
    'ok 1 caught async throw',
    'ok 2 we reach this',
    '',
    '1..2',
    '# tests 2',
    '# pass  2',
    '',
    '# ok',
    '',
    '',
  ];
  var tap = res.tap;
  t.deepEqual(res.tap, expected, 'output identical');
});

test('reference error test', function *(t) {
  var res = yield runbndg('referenceerror.spawn');
  var expected = [
    'TAP version 13',
    '# reference errors reported',
    'not ok 1 l is not defined',
    '  ---',
    '    operator: error',
    '    expected: undefined',
    '    actual:   [ReferenceError: l is not defined]',
    '    stack:',
    '      ReferenceError: l is not defined',
    '        at ./bandage/test/referenceerror.test.js:4:8',
    '        at GeneratorFunctionPrototype.next (native)',
    '        at ./bandage/lib/index.js:7:14',
    '        at GeneratorFunctionPrototype.next (native)',
    '        at onFulfilled (./bandage/node_modules/co/index.js:64:19)',
    '        at ./bandage/node_modules/co/index.js:53:5',
    '        at co (./bandage/node_modules/co/index.js:49:10)',
    '        at Test.wrapped (./bandage/lib/index.js:6:5)',
    '        at Test.bound [as _cb] (./bandage/node_modules/tape/lib/test.js:62:32)',
    '        at Test.run (./bandage/node_modules/tape/lib/test.js:75:10)',
    '  ...',
    'not ok 2 test exited without ending',
    '  ---',
    '    operator: fail',
    '  ...',
    '',
    '1..2',
    '# tests 2',
    '# pass  0',
    '# fail  2',
    '',
    '',
  ];

  var tap = res.tap;
  t.equal(res.tap.length, expected.length, 'got same-ish output');

  t.equal('      ReferenceError: l is not defined', expected[8], 'counting 1');
  t.equal(expected[8], res.tap[8], 'actual error line present');
  t.equal('not ok 2 test exited without ending', expected[20], 'counting 2');
  t.equal(expected[20], res.tap[20], 'not ok 2 line present');
});
