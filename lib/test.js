'use strict';

let co = require('co');
let equals = require('equals');
let stackTrace = require('stack-trace');

let trace = function (err) {
  var ctx = err instanceof Error ? stackTrace.parse(err) : stackTrace.get();
  var callSite = ctx.find(x => x.getFileName() !== __filename)
  return callSite.getFunctionName() + ' (' +
         callSite.getFileName() + ':' +
         callSite.getLineNumber() + ':' +
         callSite.getColumnNumber() + ')';
};

class Test {

  constructor(name, opts, fn) {
    let args   = [name, opts, fn];
    this._name = args.find(x => typeof x === 'string'  ) || '(anonymous)';
    this._opts = args.find(x => typeof x === 'object'  ) || {};
    this._fn   = args.find(x => typeof x === 'function');

    if (!this._fn)
      throw new TypeError('Test function not defined');

    if (this._fn.constructor.name !== 'GeneratorFunction')
      throw new TypeError('Function for test "' + name + '" is not a generator');

    this._results = [];
    this._plan    = null;

    Test.instances = Test.instances || [];
    Test.instances.push(this);
  }

  _push(result) {
    if (!result.ok && !result.trace) {
      result.trace = trace();
    }
    this._results.push(result);
  }
  _compare(fn, name, actual, expected, msg) {
    this._push({ok: fn(actual, expected), operator: name, expected, actual, msg});
  }

  *run() {
    let err = yield co(this._fn(this)).then(() => null).catch(err => err);

    if (err)
      this.error(err);

    if (this._plan && this._plan.count !== this._results.length) {
      this._push({
        ok      : false,
        operator: 'plan',
        expected: this._plan.count,
        actual  : this._results.length,
        trace   : this._plan.trace,
        msg     : 'number of assertions != plan'
      });
    }

    return {
      ok      : !err && this._results.every(x => x.ok),
      operator: 'test',
      results : this._results,
      msg     : this._name
    };
  }
  plan(n) {
    this._plan = {
      count: n,
      trace: trace()
    };
  }

  compare(fn, actual, expected, msg) {
    this._compare(fn, 'compare', actual, expected, msg);
  }

  ok(actual, msg) {
    this._compare(x => x, 'ok', actual, true, msg);
  }
  not(actual, msg) {
    this._compare(x => !x, 'not', actual, false, msg);
  }

  eq(actual, expected, msg) {
    this._compare(equals, 'eq', actual, expected, msg);
  }
  ne(actual, expected, msg) {
    this._compare((x,y) => !equals(x,y), 'ne', actual, expected, msg);
  }

  in(actual, expected, msg) {
    this._compare((x,y) => y.indexOf(x) !== -1, 'in', actual, expected, msg);
  }

  *test(name, opts, fn) {
    let results = yield new Test(name, opts, fn).run();
    this._push(results);
  }

  *throws(fn, expected, msg) {
    if (typeof expected === 'string') {
      msg = expected;
      expected = Error;
    }

    let actual = yield co(fn()).then(() => null).catch(err => err);
    let ok = !actual;

    if (typeof expected === 'function') {
      ok = actual instanceof expected;
      actual = actual.constructor;
    } else if (expected instanceof RegExp) {
      ok = actual && expected.test(actual.message);
    }

    this._push({ok, operator: 'throws', expected, actual, msg});
  }
  *notThrows(fn, expected, msg) {
    if (typeof expected === 'string') {
      msg = expected;
      expected = undefined;
    }

    let actual = yield co(fn()).then(() => null).catch(err => err);
    let ok = !actual;

    this._push({ok, operator: 'notThrows', expected, actual, msg});
  }

  fail(msg) {
    this._push({ok: false, operator: 'fail', msg});
  }

  pass(msg) {
    this._push({ok: true, operator: 'pass', msg});
  }

  error(err, msg) {
    this._push({
      ok: !err,
      operator: 'error',
      actual: err,
      trace: trace(err),
      msg: msg || String(err)
    });
  }
}

// aliases
Test.prototype.compareWith =
Test.prototype.compare

Test.prototype.true =
Test.prototype.ok

Test.prototype.false =
Test.prototype.notOk =
Test.prototype.notok =
Test.prototype.not

Test.prototype.deepEquals =
Test.prototype.deepEqual =
Test.prototype.equals =
Test.prototype.equal =
Test.prototype.is =
Test.prototype.eq

Test.prototype.notDeepEquals =
Test.prototype.notDeepEqual =
Test.prototype.isNotEqual =
Test.prototype.notEquals =
Test.prototype.notEqual =
Test.prototype.isNot =
Test.prototype.neq =
Test.prototype.ne

module.exports = Test;
