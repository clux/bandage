# bandage
Generator based tape testing.

## Usage
Use like if [tape](https://npmjs.org/package/tape) supported generator functions. Ignore `t.end()` and `t.plan()`. Just write some tests in a generator function, and errors will be caught for you.

```js
var test = require('bandage');

test('some test', function *(t) {
  var v = yield Promise.resolve(true);
  throw new Error('this stack gets shown in trace')
  t.ok(v, 'not reached');
});
```

Then run it:

```sh
node test/some.test.js
```

and you will receive

```sh
TAP version 13
# some test
not ok 1 this stack gets shown in trace
  ---
    operator: error
    expected: undefined
    actual:   [Error: this stack gets shown in trace]
    stack:
      Error: this stack gets shown in trace
        at repl:3:7
        at GeneratorFunctionPrototype.next (native)
        at onFulfilled (/home/clux/repos/bandage/node_modules/co/index.js:64:19)
        at process._tickDomainCallback (node.js:400:9)
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
