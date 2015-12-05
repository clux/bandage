# bandage
[![npm status](http://img.shields.io/npm/v/bandage.svg)](https://www.npmjs.org/package/bandage)
[![build status](https://secure.travis-ci.org/clux/bandage.svg)](http://travis-ci.org/clux/bandage)
[![coverage status](http://img.shields.io/coveralls/clux/bandage.svg)](https://coveralls.io/r/clux/bandage)
[![dependency status](https://david-dm.org/clux/bandage.svg)](https://david-dm.org/clux/bandage)

Generator best test harness and test runner.

## Usage
Use like if [tape](https://npmjs.org/package/tape) supported generator functions. Just always pass a generator function to `test` and stop calling `end/done`. The test is always done when the function is done.

```js
var test = require('bandage');

test('yielding test', function *(t) {
  t.equal(5, 2+3, 'addition works');
  var v = yield Promise.resolve(true);
  t.ok(v, 'promise resolved correctly');
});

test('plain test', function *(t) {
  t.equal(6, 2*3, 'multiplication works');
});
```

Which you can run with the bundled (vowel-free) `bndg` executable:

```sh
$ bndg test.js
TAP version 13
# yielding test
ok 1 addition works
ok 2 promise resolved correctly
# plain test
ok 3 multiplication works

1..3
# tests 3
# pass  3
# fail  0
```

## Error handling
By default, bandage catches errors and passes them to `t.error` by default, meaning you will get a test failure with its stack trace. Here's an example:

```js
var test = require('bandage');

var rejecting = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error('async reject'));
    });
  });
};

test('error is caught', function *T(t) {
  yield rejecting();
  t.fail('we do not reach this');
});
```

Which will output:

```sh
TAP version 13
# error is caught
not ok 1 Error: async reject
  ---
    operator: error
    expected: undefined
    actual: [Error: async reject]
    at: null._onTimeout (/path/to/test.js:6:14)
    stack:
      Error: async reject
        at null._onTimeout (/path/to/test.js:6:14)
        at Timer.listOnTimeout (timers.js:92:15)
  ...

1..1
# tests 1
# pass  0
# fail  1
```

If you would like to test that errors are correctly passed through, just catch them yourself:

```js
var test = require('bandage');

var rejecting = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error('async reject'));
    });
  });
};

test('error is caught', function *T(t) {
  t.plan(2);
  try {
    yield rejecting();
  }
  catch (err) {
    t.equal(err.message, 'async reject', 'caught async reject');
  }
  t.pass('we do reach this');
});
```

Which will output:

```sh
TAP version 13
# error is caught
ok 1 caught async reject
ok 2 we do reach this

1..2
# tests 2
# pass  2
# fail  0
```

If something unexpectedly throws in some callback stack that isn't matched by anything, that will still provide a TAP breaking stack trace. That is still a failed test though - there's only so much we can do at this point.

## Subtests
Subtests work with bandage. The only difference is you need to `yield` it:

```js
var test = require('bandage');

var slow = function () {
  return new Promise(function (res) {
    setTimeout(function () {
      res(true);
    }, 50);
  });
};

test('nested tests', function *(t) {
  var a = yield slow();
  t.ok(a, 'waited for slow');

  yield t.test('subtest', function *(st) {
    var b = yield slow();
    st.ok(b, 'waited for slow in subtest');
  });

  t.pass('pass after waiting for subtest')
});
```

Which outputs

```bash
TAP version 13
# nested tests
ok 1 waited for slow
ok 2 subtest
ok 3 waited for slow in subtest
ok 4 pass after waiting for subtest

1..4
# tests 4
# pass  4
# fail  0
```

## Setup and Teardown
Because tests are executed sequentially in the order of the file, you can create setup tests at the top of your file, and teardown tests at the bottom.
