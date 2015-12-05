var test = require('../');

var state;

test('setup-like', function *T(t) {
  t.ok(true, 'asserting in setup');
  state = yield Promise.resolve('hi');
  t.ok(state, 'could yield in setup');
});

var slow = function () {
  return new Promise(function (res) {
    setTimeout(function () {
      res(true);
    }, 50);
  });
};

test('top-to-bottom', function *T(t) {
  t.equal(state, 'hi','state fetched during first test');
});

test('block', function *T(t) {
  var a = yield slow();
  t.ok(a, 'waited for slow');
  yield t.test('subtest', function *T2(st) {
    var a2 = yield slow();
    st.ok(a2, 'waited for slow in subtest');
  });
  t.pass('pass after waiting for subtest');
});

test('basic', function *T(t) {
  var v = yield Promise.resolve(false);
  t.ok(!v, 'can use ok');
  t.equal(v, false, 'can use equal');
  t.ok(true, 'heyo');
  t.type({}, 'object', 'typeof check');
  t.instance(function(){}, Function, 'instance check');
});
