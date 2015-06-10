var test = require('../');

test('setup', function *(t) {
  t.ok(true, 'asserting in setup');
  this.a = yield Promise.resolve('hi');
  t.ok(this.a, 'could yield in setup');
});

var slow = function () {
  return new Promise(function (res) {
    setTimeout(function () {
      res(true);
    }, 500);
  });
};

test('block', function *(t) {
  var a = yield slow();
  t.ok(a, 'waited for slow');
  t.ok(!this.b, 'next test has not started yet');
});

test('basic', function *(t) {
  this.b = true;
  var v = yield Promise.resolve(false);
  t.ok(!v, 'can use ok');
  t.equal(v, false, 'can use equal');
  t.ok(true, 'heyo');
  t.equal(this.a, 'hi','can read setup state');
});

test('tests', function *(t) {
  t.ok(true, 'asserting in teardown');
  t.equal(this.a, 'hi','state set through setup');
});
