#!/usr/bin/env node

var path = require('path');
var test = require('.');
var argv = require('minimist')(process.argv.slice(2));

if (argv.h || argv.help) {
  console.log('bndg [-t testIndex] testfile.js ..');
  process.exit(0);
}

var testIndices = [];
if (argv.t != null) {
  var testIndices = Array.isArray(argv.t) ? argv.t : [argv.t]
}

/**
 * bndg executable
 *
 * Usage: bndg test/file1.js test/file2.js
 *
 * You must rely on your shell to do wildcard expansions:
 * bndg test/*.test.js
 * This will pass all js files as arguments to this file
 */

argv._.forEach(file => {
  require(path.resolve(process.cwd(), file));
});

test.run(testIndices, process.exit);
