# bandage
[![build status](https://secure.travis-ci.org/clux/bandage.svg)](http://travis-ci.org/clux/bandage)
[![coverage status](http://img.shields.io/coveralls/clux/bandage.svg)](https://coveralls.io/r/clux/bandage)
[![dependency status](https://david-dm.org/clux/bandage.svg)](https://david-dm.org/clux/bandage)
[![development dependency status](https://david-dm.org/clux/bandage/dev-status.svg)](https://david-dm.org/clux/bandage#info=devDependencies)

Generator based tape testing.

## Usage
Use like if [tape](https://npmjs.org/package/tape) supported generator functions. Ignore `t.end()`. Just write some tests in a generator function, and errors will be caught for you.

```js
var test = require('bandage');

test('some test', function *(t) {
  var v = yield Promise.resolve(true);
  t.ok(v, 'promise resolved correctly');
});
```

Which you can run with the bundled `bndg` executable:

```sh
$ bndg test.js
TAP version 13
# some test
ok 1 promise resolved correctly

1..1
# tests 1
# pass  1

# ok
```

The `t` object is the same `tape` object that's normally passed to [tape](https://npmjs.org/package/tape).

## Error handling
By default, bandage catches errors and passes them to `t.error` by default, meaning you will get a test failure with its stack trace. Here's an example:

```js
var test = require('bandage');

var throwing = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error('async throw'));
    });
  });
};

test('throw is caught', function *(t) {
  yield throwing();
  t.fail('we do not reach this');
});
```

Which will output:

```sh
TAP version 13
# throw is caught
not ok 1 async throw
  ---
    operator: error
    expected: undefined
    actual:   [Error: async throw]
    stack:
      Error: async throw
        at null._onTimeout (/path/to/test.js:6:14)
        at Timer.listOnTimeout (timers.js:89:15)
  ...
not ok 2 test exited without ending
  ---
    operator: fail
  ...

1..2
# tests 2
# pass  0
# fail  2
```

If you would like to test that errors are correctly thrown, just catch them yourself:

```js
var test = require('bandage');

var throwing = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error('async throw'));
    });
  });
};

test('throw is caught', function *(t) {
  try {
    yield throwing();
    t.fail('we do not reach this');
  }
  catch (err) {
    t.equal(err.message, 'async throw', 'caught async throw');
  }
  t.ok(true, 'we reach this');
});
```

Which will output:

```sh
TAP version 13
# throw is caught
ok 1 caught async throw
ok 2 we reach this

1..2
# tests 2
# pass  2

# ok
```

## Setup and Teardown
Because tests are executed sequentially in the order of the file, you can create setup tests at the top of your file, and teardown tests at the bottom.
