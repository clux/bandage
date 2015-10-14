var test = require('../');

var rejectedPromise = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error('reject error'));
    }, 200);
  });
};

test('promise failure', function *T(t) {
  var v = yield rejectedPromise();
  t.ok(v, 'not reached');
});
