var test = require('../');

test('verify assert api', function *(t) {
  try {
    test('asserting', function (t) {
      t.ok(true, 'wont reach this');
    });
  }
  catch (e) {
    t.equal(e.message, 'Test function "asserting" must be a generator function');
  }
});
