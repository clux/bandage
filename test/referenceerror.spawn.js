var test = require('../');

test('reference errors reported', function *(t) {
  t.ok(l, 'woot');
  t.ok(false, 'this is not reached');
});
