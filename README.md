# bandage
[![build status](https://secure.travis-ci.org/clux/bandage.svg)](http://travis-ci.org/clux/bandage)
[![coverage status](http://img.shields.io/coveralls/clux/bandage.svg)](https://coveralls.io/r/clux/bandage)
[![dependency status](https://david-dm.org/clux/bandage.svg)](https://david-dm.org/clux/bandage)
[![development dependency status](https://david-dm.org/clux/bandage/dev-status.svg)](https://david-dm.org/clux/bandage#info=devDependencies)

Tape with generator functions.

## Usage
Use like if [tape](https://npmjs.org/package/tape) supported generator functions. Just use generator functions when you need asynchronous behaviour, and don't use any `end/done` - test is done when the function is done.

```js
var test = require('bandage');

test('yielding test', function *T(t) {
  t.equal(5, 2+3, 'addition works');
  var v = yield Promise.resolve(true);
  t.ok(v, 'promise resolved correctly');
});

test('plain test', function T(t) {
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

# ok
```

The `t` object is the same `tape` object that's normally passed to [tape](https://npmjs.org/package/tape).

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
not ok 1 async reject
  ---
    operator: error
    expected: undefined
    actual:   [Error: async reject]
    stack:
      Error: async reject
        at null._onTimeout (/path/to/thefileabove.js:6:14)
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

# ok
```

If something unexpectedly throws in some callback stack that isn't matched by anything, that will still provide a TAP breaking stack trace. That is still a failed test though - there's only so much we can do at this point.

## Setup and Teardown
Because tests are executed sequentially in the order of the file, you can create setup tests at the top of your file, and teardown tests at the bottom.

## Naming Functions
[All functions passed to bandage should be named](http://eslint.org/docs/rules/func-names). If you do not name your functions, you will not see the line in the `at: ` property in the tap output when something fails.

It doesn't have to be descriptive or unique for each test, it just has to have a name. This is why everything here uses `function *T(t){ /*tests*/ })` or `function T(t) { /* tests*/ })`.
