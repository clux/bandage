var test = require('../');

test('reference errors reported', function *T(t) {
  t.ok(l, 'woot');
  t.ok(false, 'this is not reached');
});
