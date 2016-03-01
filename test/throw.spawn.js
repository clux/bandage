var test = require('../');

test('throwing plain function', function *() {
  throw new Error('bndg catches this');
});

test('throws', function *(t) {
  t.plan(17);

  yield t.throws(Promise.resolve(), 'promise; does not throw');
  yield t.throws(Promise.reject(), 'promise; no expected value');
  yield t.throws(Promise.reject(), Error, 'promise; does not match expected value');
  yield t.throws(Promise.reject(new Error()), Error, 'promise; matches expected value');

  yield t.throws(() => Promise.resolve(), 'function -> promise; does not throw');
  yield t.throws(() => Promise.reject(), 'function -> promise; no expected value');
  yield t.throws(() => Promise.reject(), Error, 'function -> promise; does not match expected value');
  yield t.throws(() => Promise.reject(new Error()), Error, 'function -> promise; matches expected value');

  yield t.throws(function *() { }, 'generator; does not throw');
  yield t.throws(function *() { throw new Error(); }, 'generator; no expected value');
  yield t.throws(function *() { throw new Error(); }, /lol/, 'generator; does not match expected value');
  yield t.throws(function *() { throw new Error('lol'); }, /lol/, 'generator; matches expected value');

  yield t.throws(() => { }, 'function; does not throw');
  yield t.throws(() => { throw 'lol'; }, 'function; no expected value');
  yield t.throws(() => { throw 'lol'; }, Error, 'function; does not match expected value');
  yield t.throws(() => { throw 'lol'; }, 'lol', 'function; matches expected value');

  t.ok(true, 'test execution is not halted');
});

test('notThrows', function *(t) {
  t.plan(9);

  yield t.notThrows(Promise.reject(), 'promise; throws');
  yield t.notThrows(Promise.resolve(), 'promise; ok');

  yield t.notThrows(() => Promise.reject(), 'function -> promise; throws');
  yield t.notThrows(() => Promise.resolve(), 'function -> promise; ok');

  yield t.notThrows(function *() { throw new Error(); }, 'generator; throws');
  yield t.notThrows(function *() { }, 'generator; ok');

  yield t.notThrows(() => { throw 'lol'; }, 'function; throws');
  yield t.notThrows(() => { }, 'function; ok');

  t.ok(true, 'test execution is not halted');
});
