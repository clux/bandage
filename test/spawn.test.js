var test = require('../');
var exec = require('child_process').exec;

var runbndg = function (name) {
  return new Promise(function (resolve) {
    exec('./bin.js test/' + name + '.js', function (err, stdout) {
      resolve({
        err: err,
        tap: stdout.split('\n').slice(0, -1),
      });
    });
  });
};

test('promise test', function *T(t) {
  var res = yield runbndg('promise.spawn');
  var expected = [
    'TAP version 13',
    '# promise failure',
    'not ok 1 Error: reject error',
    '  ---',
    '    operator: error',
    '    expected: undefined',
    '    actual: [Error: reject error]',
    '    at: null._onTimeout (./test/promise.spawn.js:6:14)',
    '    stack:',
    '      Error: reject error',
    '        at null._onTimeout (./test/promise.spawn.js:6:14)',
    '        at Timer.listOnTimeout (timers.js:92:15)',
    '  ...',
    '',
    '1..1',
    '# tests 1',
    '# pass  0',
    '# fail  1',
  ];

  t.equal('    actual: [Error: reject error]', expected[6], 'counting 1');
  t.equal(expected[6], res.tap[6], 'actual error line present');
});

test('throw plain test', function *T(t) {
  var res = yield runbndg('throw.spawn');
  var expected = [
    'TAP version 13',
    '# throwing plain function',
    'not ok 1 Error: bndg catches this',
    '  ---',
    '    operator: error',
    '    expected: undefined',
    '    actual: [Error: bndg catches this]',
    '    at: Test.T [as _fn] (./test/throw.spawn.js:4:9)',
    '    stack:',
    '      Error: bndg catches this',
    '        at Test.T [as _fn] (./test/throw.spawn.js:4:9)',
    '        at next (native)',
    '        at onFulfilled (./node_modules/co/index.js:65:19)',
    '        at ./node_modules/co/index.js:54:5',
    '        at co (./node_modules/co/index.js:50:10)',
    '        at Test.run (./lib/test.js:48:21)',
    '        at next (native)',
    '        at onFulfilled (./node_modules/co/index.js:65:19)',
    '        at ./node_modules/co/index.js:54:5',
    '        at co (./node_modules/co/index.js:50:10)',
    '  ...',
    '# throws',
    'not ok 2 promise; does not throw',
    '  ---',
    '    operator: throws',
    '    expected: undefined',
    '    actual: undefined',
    '    at: null (./test/throw.spawn.js:10:11)',
    '  ...',
    'ok 3 promise; no expected value',
    'not ok 4 promise; does not match expected value',
    '  ---',
    '    operator: throws',
    '    expected: [Function: Error]',
    '    actual: undefined',
    '    at: null (./test/throw.spawn.js:12:11)',
    '  ...',
    'ok 5 promise; matches expected value',
    'not ok 6 function -> promise; does not throw',
    '  ---',
    '    operator: throws',
    '    expected: undefined',
    '    actual: undefined',
    '    at: null (./test/throw.spawn.js:15:11)',
    '  ...',
    'ok 7 function -> promise; no expected value',
    'not ok 8 function -> promise; does not match expected value',
    '  ---',
    '    operator: throws',
    '    expected: [Function: Error]',
    '    actual: undefined',
    '    at: null (./test/throw.spawn.js:17:11)',
    '  ...',
    'ok 9 function -> promise; matches expected value',
    'not ok 10 generator; does not throw',
    '  ---',
    '    operator: throws',
    '    expected: undefined',
    '    actual: undefined',
    '    at: null (./test/throw.spawn.js:20:11)',
    '  ...',
    'ok 11 generator; no expected value',
    'not ok 12 generator; does not match expected value',
    '  ---',
    '    operator: throws',
    '    expected: /lol/',
    '    actual: [Error]',
    '    at: null (./test/throw.spawn.js:22:11)',
    '  ...',
    'ok 13 generator; matches expected value',
    'not ok 14 function; does not throw',
    '  ---',
    '    operator: throws',
    '    expected: undefined',
    '    actual: undefined',
    '    at: null (./test/throw.spawn.js:25:11)',
    '  ...',
    'ok 15 function; no expected value',
    'not ok 16 function; does not match expected value',
    '  ---',
    '    operator: throws',
    '    expected: [Function: Error]',
    '    actual: [Function: String]',
    '    at: null (./test/throw.spawn.js:27:11)',
    '  ...',
    'ok 17 function; matches expected value',
    'ok 18 test execution is not halted',
    '# notThrows',
    'not ok 19 promise; throws',
    '  ---',
    '    operator: notThrows',
    '    expected: undefined',
    '    actual: undefined',
    '    at: null (./test/throw.spawn.js:36:11)',
    '  ...',
    'ok 20 promise; ok',
    'not ok 21 function -> promise; throws',
    '  ---',
    '    operator: notThrows',
    '    expected: undefined',
    '    actual: undefined',
    '    at: null (./test/throw.spawn.js:39:11)',
    '  ...',
    'ok 22 function -> promise; ok',
    'not ok 23 generator; throws',
    '  ---',
    '    operator: notThrows',
    '    expected: undefined',
    '    actual: [Error]',
    '    at: null (./test/throw.spawn.js:42:11)',
    '  ...',
    'ok 24 generator; ok',
    'not ok 25 function; throws',
    '  ---',
    '    operator: notThrows',
    '    expected: undefined',
    '    actual: \'lol\'',
    '    at: null (./test/throw.spawn.js:45:11)',
    '  ...',
    'ok 26 function; ok',
    'ok 27 test execution is not halted',
    '',
    '1..27',
    '# tests 27',
    '# pass  14',
    '# fail  13'
  ];

  t.equal('    actual: [Error: bndg catches this]', expected[6], 'counting 1');
  t.equal(expected[6], res.tap[6], 'actual error line present');

  var tlines = [22,29,30,37,38,45,46,53,54,61,62,69,70,77,78,85,86];
  t.equal(
    tlines.map(x => res.tap[x]),
    tlines.map(x => expected[x]),
    'throws behaviour works as expected'
  );
  var ntlines = [88,95,96,103,104,111,112,119,120];
  t.equal(
    ntlines.map(x => res.tap[x]),
    ntlines.map(x => expected[x]),
    'notThrows behaviour works as expected'
  );
});

test('basic test', function *T(t) {
  var res = yield runbndg('basic.test');
  var expected = [
    'TAP version 13',
    '# setup-like',
    'ok 1 asserting in setup',
    'ok 2 could yield in setup',
    '# top-to-bottom',
    'ok 3 state fetched during first test',
    '# block',
    'ok 4 waited for slow',
    'ok 5 subtest',
    'ok 6 waited for slow in subtest',
    'ok 7 pass after waiting for subtest',
    '# basic',
    'ok 8 can use ok',
    'ok 9 can use equal',
    'ok 10 heyo',
    'ok 11 typeof check',
    'ok 12 instance check',
    'ok 13 this is eqeq null',
    '# (anonymous)',
    'ok 14 anonymous test',
    '',
    '1..14',
    '# tests 14',
    '# pass  14',
  ];

  var tap = res.tap;
  t.in('# tests 14', tap[22], '14 tests');
  t.in('# pass  14', tap[23], '14 passes');
  t.deepEqual(res.tap, expected, 'identical output');
});

test('catch test', function *T(t) {
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
  ];
  t.deepEqual(res.tap, expected, 'output identical');
});

test('reference error test', function *T(t) {
  var res = yield runbndg('referenceerror.spawn');
  var expected = [
    'TAP version 13',
    '# reference errors reported',
    'not ok 1 ReferenceError: l is not defined',
    '  ---',
    '    operator: error',
    '    expected: undefined',
    '    actual: [ReferenceError: l is not defined]',
    '    at: Test.T [as _fn] (./test/referenceerror.spawn.js:4:8)',
    '    stack:',
    '      ReferenceError: l is not defined',
    '        at Test.T [as _fn] (./test/referenceerror.spawn.js:4:8)',
    '        at next (native)',
    '        at onFulfilled (./node_modules/co/index.js:65:19)',
    '        at ./node_modules/co/index.js:54:5',
    '        at co (./node_modules/co/index.js:50:10)',
    '        at Test.run (./lib/test.js:48:21)',
    '        at next (native)',
    '        at onFulfilled (./node_modules/co/index.js:65:19)',
    '        at ./node_modules/co/index.js:54:5',
    '        at co (./node_modules/co/index.js:50:10)',
    '  ...',
    '',
    '1..1',
    '# tests 1',
    '# pass  0',
    '# fail  1',
  ];

  t.equal(res.tap.length, expected.length, 'got same-ish output');

  t.equal('      ReferenceError: l is not defined', expected[9], 'counting 1');
  t.equal(expected[9], res.tap[9], 'actual error line present');
  t.ok(res.tap[10].indexOf('referenceerror.spawn.js:4:8') > 0, 'correct trace');
});

test('at test', function *T(t) {
  var res = yield runbndg('at.spawn');
  var expected = [
    'TAP version 13',
    '# nice output plain',
    'not ok 1 plain',
    '  ---',
    '    operator: eq',
    '    expected: false',
    '    actual: true',
    '    at: T (./test/at.spawn.js:3:5)',
    '  ...',
    '# nice output generator',
    'not ok 2 gen',
    '  ---',
    '    operator: eq',
    '    expected: false',
    '    actual: true',
    '    at: T (./test/at.spawn.js:7:5)',
    '  ...',
    '',
    '1..2',
    '# tests 2',
    '# pass  0',
    '# fail  2',
  ];
  t.equal(res.tap.length, expected.length, 'got same-ish output');

  t.ok(res.tap[7].indexOf('at: T (') >= 0, 'plain.at T with file');
  t.ok(res.tap[7].indexOf('at.spawn.js:3:5)') >= 0, 'plain.at T with line');

  t.ok(res.tap[15].indexOf('at: T (') >= 0, 'gen.at T with file');
  t.ok(res.tap[15].indexOf('at.spawn.js:7:5)') >= 0, 'gen.at T with line');
});

test('failoutput test', function *T(t) {
  var res = yield runbndg('failoutput.spawn');
  var expected = [
    'TAP version 13',
    '# null',
    'ok 1 true null',
    'ok 2 true undef',
    'not ok 3 empty array is not null',
    '  ---',
    '    operator: null',
    '    expected: null',
    '    actual: []',
    '    at: T (./test/failoutput.spawn.js:6:9)',
    '  ...',
    '# not',
    'ok 4 false is not true',
    'not ok 5 true is not not true',
    '  ---',
    '    operator: not',
    '    expected: false',
    '    actual: true',
    '    at: T (./test/failoutput.spawn.js:11:5)',
    '  ...',
  ];
  var num_masks = 0;
  for (var i = 0; i < res.tap.length; i += 1) {
    // ignore mismatches relating to full path
    if (res.tap[i].indexOf('    at: T') === 0) {
      num_masks += 1;
      res.tap[i] = expected[i];
    }
  }
  t.eq(res.tap.slice(0, expected.length), expected, 'output identical');
  t.eq(num_masks, 2, 'amount of at lines replaced');
});
