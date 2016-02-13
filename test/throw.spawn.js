var test = require('../');

test('throwing plain function', function *() {
  throw new Error('bndg catches this');
});
