'use strict';

let inspect = require('object-inspect');

let indent = function (str) {
  return str.split('\n').map(x => '  ' + x).join('\n');
};

let yaml = function (str) {
  return '---\n' + indent(str) + '\n...';
};

let error = function (test) {
  let out =
    'operator: ' + test.operator + '\n' +
    'expected: ' + inspect(test.expected) + '\n' +
    'actual: ' + inspect(test.actual);

  if (test.trace)
    out += '\ntrace: ' + test.trace;

  if (test.operator === 'error' && test.actual instanceof Error)
    out += '\nstack:\n  ' + test.actual.stack;

  return yaml(out);
};

let tap = function (test, num) {
  let out = (test.ok ? 'ok' : 'not ok') + ' ' + num + ' ' + test.msg;

  if (!test.ok && test.operator !== 'test')
    out += '\n' + indent(error(test));

  return out;
};

module.exports = tap;
