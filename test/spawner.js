//var cp = require('child_process');
var exec = require('mz/child_process').exec
var test = require('../');

test('basic test ok', function *(t) {
  // expected output (paths will be different)
  [
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
  var stdout = yield exec('node test/basic.test.js');
  var lines = stdout.toString().split('\n');

  t.equal(lines.indexOf('# tests 10'), 17, '10 tests');
  t.equal(lines.indexOf('# pass  10'), 18, '10 passes');
  t.equal(lines.indexOf('# ok'), 20, 'output ok');
});

test('error test ok', function *(t) {
  // expected output (paths will be different)
  [
    'TAP version 13',
    '# failure shows up normally',
    'not ok 1 bad',
    '  ---',
    '    operator: ok',
    '    expected: true',
    '    actual:   false',
    '    at: onFulfilled (./bandage/node_modules/co/index.js:64:19)',
    '  ...',
    '# throw is caught',
    'not ok 2 lets throw an error',
    '  ---',
    '    operator: error',
    '    expected: undefined',
    '    actual:   [Error: lets throw an error]',
    '    stack:',
    '      Error: lets throw an error',
    '        at ./bandage/test/error.test.js:10:9',
    '        at GeneratorFunctionPrototype.next (native)',
    '        at onFulfilled (./bandage/node_modules/co/index.js:64:19)',
    '        at ./bandage/node_modules/co/index.js:53:5',
    '        at co (./bandage/node_modules/co/index.js:49:10)',
    '        at toPromise (./bandage/node_modules/co/index.js:117:63)',
    '        at next (./bandage/node_modules/co/index.js:98:29)',
    '        at onFulfilled (./bandage/node_modules/co/index.js:68:7)',
    '        at ./bandage/node_modules/co/index.js:53:5',
    '        at co (./bandage/node_modules/co/index.js:49:10)',
    '  ...',
    'not ok 3 test exited without ending',
    '  ---',
    '    operator: fail',
    '  ...',
    '',
    '1..3',
    '# tests 3',
    '# pass  0',
    '# fail  3',
    '',
    ''
  ];
  try {
    var stdout = yield exec('node test/error.test.js');
  }
  catch (err) {
    t.ok(err, err ? err.message : 'command should have failed');
  }

  // TODO: want to verify stoud as well - but mz/child_process doesnt give you both
  ////var tap = stdout.split('\n');
  //t.equal(tap.indexOf('not ok 2 lets throw an error'), 10, 'error caught');
  //t.equal(tap.indexOf('      Error: lets throw an error'), 16, 'printed nicely');
  //t.equal(tap.indexOf('not ok 3 test exited without ending'), 28, 'flow halted');
});

test('reference errors caught', function *(t) {
  // expected output (paths will be different)
  [
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
    '        at onFulfilled (./bandage/node_modules/co/index.js:64:19)',
    '        at ./bandage/node_modules/co/index.js:53:5',
    '        at co (./bandage/node_modules/co/index.js:49:10)',
    '        at toPromise (./bandage/node_modules/co/index.js:117:63)',
    '        at next (./bandage/node_modules/co/index.js:98:29)',
    '        at onFulfilled (./bandage/node_modules/co/index.js:68:7)',
    '        at ./bandage/node_modules/co/index.js:53:5',
    '        at co (./bandage/node_modules/co/index.js:49:10)',
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
    ''
  ];

  try {
    var stdout = yield exec('node test/referenceerror.test.js');
  }
  catch (err) {
    t.ok(err, err ? err.message : 'command should have failed');
  }

  // TODO: want to verify stdout as well - but mz/child_process doesnt give you both
  //var tap = stdout.toString().split('\n');
  //t.equal(tap.indexOf('not ok 1 l is not defined'), 2, 'error caught');
  //t.equal(tap.indexOf('      ReferenceError: l is not defined'), 8, 'printed');
  //t.equal(tap.indexOf('not ok 2 test exited without ending'), 20, 'flow halted');
});

test('promise rejections caught', function *(t) {
  // expected output (paths will be different)
  [
    'TAP version 13',
    '# promise rejection caught',
    'not ok 1 hi there',
    '  ---',
    '    operator: error',
    '    expected: undefined',
    '    actual:   [Error: hi there]',
    '    stack:',
    '      Error: hi there',
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
    '',
    ''
  ];

  try {
    var stdout = yield exec('node test/promise.test.js');
  }
  catch (err) {
    t.ok(err, err ? err.message : 'command should have failed');
  }
  // TODO: want to verify stoud as well - but mz/child_process doesnt give you both
  //var tap = stdout.split('\n');
  //t.equal(tap.indexOf('not ok 1 hi there'), 2, 'rejection caught');
  //t.equal(tap.indexOf('    operator: error'), 4, 'passed on to t.error');
  //t.equal(tap.indexOf('not ok 2 test exited without ending'), 12, 'flow halted');
});
