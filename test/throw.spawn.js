var test = require('../');

test('throwing plain function', function *T(t) {
  throw new Error('bndg catches this');
});
