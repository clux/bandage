var test = require('../');
test('nice output plain', function *T(t) {
  t.equal(true, false, 'plain');
});

test('nice output generator', function *T(t) {
  t.equal(true, false, 'gen');
});
