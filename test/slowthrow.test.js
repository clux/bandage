var test = require('../');

var rejectedPromise = function () {
  setTimeout(function () {
    reject(new Error('hi there'));
  }, 200);
};

test('promise rejection caught', function *(t) {
  var v = yield rejectedPromise();
  t.ok(v, 'not reached');
});
