var test = require('../');
test('nice output plain', function (t) {
  t.equal(true, false, 'plain');
});

test('nice output generator', function *(t) {
  t.equal(true, false, 'gen');
});
