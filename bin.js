#!/usr/bin/env node

var path = require('path');
var test = require('.');

/**
 * bndg executable
 *
 * Usage: bndg test/file1.js test/file2.js
 *
 * You must rely on your shell to do wildcard expansions:
 * bndg test/*.test.js
 * This will pass all js files as arguments to this file
 */

process.argv.slice(2).forEach((file) => {
  require(path.resolve(process.cwd(), file));
});

test.run();
