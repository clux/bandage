var test = require('../');

test('throwing plain function', function T() {
  throw new Error('bndg catches this');
});
