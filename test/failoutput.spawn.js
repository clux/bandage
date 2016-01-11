var test = require('../');

test('null', function *T(t) {
  t.null(null, 'true null');
  t.null(undefined, 'true undef');
  t.null([], 'empty array is not null');
});

test('not', function *T(t) {
  t.not(false, 'false is not true');
  t.not(true, 'true is not not true');
});
