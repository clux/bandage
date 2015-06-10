var test = require('../');

test('failure shows up normally', function *(t) {
  var v = yield Promise.resolve(false);
  t.ok(v, 'bad');
});

test('throw is caught', function *(t) {
  throw new Error('lets throw an error');
  t.ok(false, 'this is not reached');
});
