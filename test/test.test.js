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
    st.plan(5);
    st.ne(1, 2, 'not equals');
    st.not(false, 'false');
    st.compare((x,y) => x == y, null, undefined, 'eqnull');
    st.in(5, [1,2,3,4,5], 'elem');
    yield st.test('subtest', function *(sst) {
      sst.pass('pass subtest');
    });
  });

  var res = yield inst.run();

  var expected = [
    { actual: 1, expected: 2, msg: 'not equals', ok: true, operator: 'ne' },
    { actual: false, expected: false, msg: 'false', ok: true, operator: 'not' },
    { actual: null, expected: undefined, msg: 'eqnull', ok: true, operator: 'compare' },
    { actual: 5, expected: [ 1, 2, 3, 4, 5 ], msg: 'elem', ok: true, operator: 'in' },
    {
      msg: 'subtest', ok: true, operator: 'test', results: [
        { msg: 'pass subtest', ok: true, operator: 'pass' }
      ]
    }
  ]

  t.eq(res.results, expected, 'expected results');
  t.ok(res.ok, 'tests passed');
  t.equal(res.operator, 'test', 'run operator');
  t.equal(res.msg, 'invoke', 'test message');

  // verify tap messages
  t.eq(tap(expected[0], 1), 'ok 1 not equals', 'tap message 1');
  t.eq(tap(expected[1], 2), 'ok 2 false', 'tap message 2');
  t.eq(tap(expected[2], 3), 'ok 3 eqnull', 'tap message 3');
  t.eq(tap(expected[3], 4), 'ok 4 elem', 'tap message 4');
  t.eq(tap(expected[4], 5), 'ok 5 subtest', 'tap message 5');
  t.eq(tap(expected[4].results[0], 6), 'ok 6 pass subtest', 'tap message 6');
});

test('Test input validation', function *T(t) {
  var thrower = function *() {
    new Test('test without function', {});
  };
  yield t.throws(thrower, /Test function/, 'need test fn');
  yield t.throws(thrower, TypeError, 'need test fn is TypeError');
  yield t.throws(thrower, 'need test fn - without specific catch');

  var thrower2 = function *() {
    new Test('test without generator', function () {});
  }
  yield t.throws(thrower2, /is not a generator/, 'need gen fn');
  yield t.throws(thrower2, TypeError, 'need gen fn is TypeError');

  var nonthrower = function *() {
    new Test('working', function *() {});
  };
  yield t.notThrows(nonthrower, 'can construct without opts');

  var nonthrower2 = function *() {
    new Test('working', {}, function *() {});
  };
  yield t.notThrows(nonthrower2, 'can construct with opts');
});

test('Test fail', function *T(t) {
  var inst = new Test('invoke', function *T2(st) {
    st.fail('this fails');
  });

  var res = yield inst.run();
  var expected = {
    msg: 'this fails',
    ok: false,
    operator: 'fail',
    trace: 'T2 (' + __dirname + '/test.test.js:103:8)'
  };

  t.eq(res.results, [expected], 'expected results');
  t.false(res.ok, 'tests failed');
  t.equal(res.operator, 'test', 'run operator');
  t.equal(res.msg, 'invoke', 'test message');

  // verify tap failure message
  var failEq = tap(expected, 1);
  var failExp = [
    'not ok 1 this fails',
    '  ---',
    '    operator: fail',
    '    expected: undefined',
    '    actual: undefined',
    '    at: T2 (' + __dirname + '/test.test.js:103:8)',
    '  ...',
  ];
  t.eq(failEq, failExp.join('\n'), 'tap fail message');
});

test('Test catch mechanics', function *T(t) {
  var errorObj = new Error('hi there');
  var inst = new Test('invoke', function *T2() {
    throw errorObj;
  });
  var res = yield inst.run();
  t.false(res.ok, 'tests fail when random errors arent caught');
  var expected = {
    ok: false,
    operator: 'error',
    actual: errorObj,
    trace: 'Test.T [as _fn] (' + __dirname + '/test.test.js:134:18)',
    msg: 'Error: hi there',
  }
  t.eq(res.results, [expected], 'caught error in test');

  var failExp = [
    'not ok 1 Error: hi there',
    '  ---',
    '    operator: error',
    '    expected: undefined', // TODO: this is a little ugly
    '    actual: [Error: hi there]',
    '    at: Test.T [as _fn] (' + __dirname + '/test.test.js:134:18)',
    '    stack:',
    '      Error: hi there',
    '        at Test.T [as _fn] (' + __dirname + '/test.test.js:134:18)',
    '        at more frames',
    '  ...',
  ];
  //console.log(tap(expected, 1))
  t.eq(tap(expected, 1).split('\n').slice(0, 9),
    failExp.slice(0, 9),
    'tap message with trace matches modulo dependencies'
  );
  t.eq(tap(expected, 1).split('\n').slice(-1)[0], failExp[10], 'last line eq');
});

test('Test catch mechanics', function *T(t) {
  var inst = new Test('invoke', function *T2(st) {
    st.plan(1);
  });
  var res = yield inst.run();
  t.false(res.ok, 'tests fail when plan is not met');
  var expected = {
    actual: 0,
    expected: 1,
    msg: 'number of assertions != plan',
    ok: false,
    operator: 'plan'
  };
  t.ok(res.results[0].trace, 'plan has trace');
  delete res.results[0].trace;
  t.eq(res.results, [expected], 'plan failed');
});
