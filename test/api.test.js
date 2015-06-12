var test = require('../');

test('generator inpu', function *(t) {
  t.pass('can pass generators');
});

// this suppresses a by-default jshint warning so allow the simplification
test('verify api', function (t) {
  t.pass('can pass non-generators');
});
