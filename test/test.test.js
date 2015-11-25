var test = require('../');
var Test = test.Test;
var tap = require('../lib/tap')

test('Test basic', function *T(t) {
  var inst = new Test('invoke', function *T2(st) {
    st.ok(true, 'yep');
    st.equals(1, 2, 'not right');
  });

  var res = yield inst.run();
  var expected = [
    { actual: true, expected: true, msg: 'yep', ok: true, operator: 'ok' },
    { actual: 1, expected: 2, msg: 'not right', ok: false, operator: 'eq' },
  ];
  t.ok(res.results[1].trace, 'error has trace')
  delete res.results[1].trace; // dont verify it fully - done elsewhere
  t.eq(res.results, expected, 'expected results');
  t.false(res.ok, 'tests failed');
  t.equal(res.operator, 'test', 'run operator');
  t.equal(res.msg, 'invoke', 'test message');

  // verify tap failure message
  var failEq = tap(expected[1], 2);
  var failExp = [
    'not ok 2 not right',
    '  ---',
    '    operator: eq',
    '    expected: 2',
    '    actual: 1',
    '  ...',
  ]
  t.eq(failEq, failExp.join('\n'), 'tap fail message');
});

test('Test pass', function *T(t) {
  var inst = new Test('invoke', function *T2(st) {
    st.ne(1, 2, 'not equals');
    st.not(false, 'false');
    st.compare((x,y) => x == y, null, undefined, 'null is undefined');
    st.in(5, [1,2,3,4,5], 'element of array');
  });

  var res = yield inst.run();
  var expected = [
    { actual: 1, expected: 2, msg: 'not equals', ok: true, operator: 'ne' },
    { actual: false, expected: false, msg: 'false', ok: true, operator: 'not' },
    { actual: null, expected: undefined, msg: 'null is undefined', ok: true, operator: 'custom' },
    { actual: 5, expected: [ 1, 2, 3, 4, 5 ], msg: 'element of array', ok: true, operator: 'in' },
  ];
  t.eq(res.results, expected, 'expected results');
  t.ok(res.ok, 'tests passed');
  t.equal(res.operator, 'test', 'run operator');
  t.equal(res.msg, 'invoke', 'test message');

  // verify tap messages
  t.eq(tap(expected[0], 1), 'ok 1 not equals', 'tap message 1');
  t.eq(tap(expected[1], 2), 'ok 2 false', 'tap message 2');
  t.eq(tap(expected[2], 3), 'ok 3 null is undefined', 'tap message 3');
  t.eq(tap(expected[3], 4), 'ok 4 element of array', 'tap message 4');
});

test('Test ctor', function *heyo(t) {
  var errObj = new Error('hi');
  var inst = new Test('invoke', function *T2(st) {
    st.error(errObj);
  });

  var res = yield inst.run();
  var expected = [
    { actual: errObj, msg: 'Error: hi', ok: false, operator: 'error' }
  ];
  t.ok(res.results[0].trace, 'error has trace')
  delete res.results[0].trace; // dont verify it fully - done elsewhere
  t.eq(res.results, expected, 'expected results');
  t.false(res.ok, 'tests failed');

  // verify tap failure message
  var failEq = tap(expected[0], 1);
  var failExp = [
    'not ok 1 Error: hi',
    '  ---',
    '    operator: error',
    '    expected: undefined',
    '    actual: [Error: hi]',
    '    stack:',
    '      Error: hi',
    '        at Test.heyo [as _fn] (./test/test.test.js:64:16)',
    '        skipped here',
    '  ...',
  ]
  t.eq(failEq.split('\n').slice(0, 7).join('\n'),
    failExp.slice(0,7).join('\n'),
    'first 7 failure lines should be equal'
  );
  t.in('at Test.heyo [as _fn]', failEq.split('\n')[7], 'correct frame');
  t.in('test/test.test.js:64:16', failEq.split('\n')[7], 'correct line');
});
