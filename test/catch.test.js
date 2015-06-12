var test = require('../');

var throwing = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error('async throw'));
    });
  });
};

test('throw is caught', function *(t) {
  t.plan(2);
  try {
    yield throwing();
    t.fail('we do not reach this');
  }
  catch (err) {
    t.equal(err.message, 'async throw', 'caught async throw');
  }
  t.ok(true, 'we reach this');
});
