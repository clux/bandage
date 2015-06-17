var test = require('../');
var exec = require('child_process').exec;

var runbndg = function (name) {
  return new Promise(function (resolve) {
    exec('./bin.js test/' + name + '.js', function (err, stdout) {
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
});

test('throw plain test', function *(t) {
  var res = yield runbndg('throw.spawn');
  var expected = [
    'TAP version 13',
    '# throwing plain function',
    'not ok 1 bndg catches this',
    '  ---',
    '    operator: error',
    '    expected: undefined',
    '    actual:   [Error: bndg catches this]',
    '    at: Test.tapeTryWrap (./lib/index.js:24:9)',
    '    stack:',
    '      Error: bndg catches this',
    '        at ./test/throw.spawn.js:4:9',
    '        at Test.tapeTryWrap (./lib/index.js:20:7)',
    '        at Test.bound [as _cb] (./n_m/tape/lib/test.js:62:32)',
    '        at Test.run (./n_m/tape/lib/test.js:75:10)',
    '        at Test.bound [as run] (./n_m/tape/lib/test.js:62:32)',
    '        at Immediate.next [as _onImmediate] (./n_m/tape/lib/results.js:66:15)',
    '        at processImmediate [as _immediateCallback] (timers.js:371:17)',
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
  t.equal('    actual:   [Error: bndg catches this]', expected[6], 'counting 1');
  t.equal(expected[6], res.tap[6], 'actual error line present');
  t.equal('not ok 2 test exited without ending', expected[18], 'counting 2');
  t.equal(expected[18], res.tap[18], 'not ok 2 line present');
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
    'ok 5 waited for slow again',
    '# basic',
    'ok 6 can use ok',
    'ok 7 can use equal',
    'ok 8 heyo',
    'ok 9 can read setup state',
    '# tests',
    'ok 10 asserting in teardown',
    'ok 11 state set through setup',
    '',
    '1..11',
    '# tests 11',
    '# pass  11',
    '',
    '# ok',
    '',
    ''
  ];
  var tap = res.tap;
  t.equal(tap.indexOf('# tests 11'), 18, '10 tests');
  t.equal(tap.indexOf('# pass  11'), 19, '10 passes');
  t.equal(tap.indexOf('# ok'), 21, 'output ok');
  t.deepEqual(res.tap, expected, 'identical output');
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

  t.equal(res.tap.length, expected.length, 'got same-ish output');

  t.equal('      ReferenceError: l is not defined', expected[8], 'counting 1');
  t.equal(expected[8], res.tap[8], 'actual error line present');
  t.equal('not ok 2 test exited without ending', expected[20], 'counting 2');
  t.equal(expected[20], res.tap[20], 'not ok 2 line present');
});
