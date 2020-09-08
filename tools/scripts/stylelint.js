#!/usr/bin/env node
const shelljs = require('shelljs');
const { join } = require('path');
const { bazelQuery, bazelTest } = require('./utils/execute-bazel');

// The workspace root
const PROJECT_DIR = join(__dirname, '../../');

// ShellJS should exit if any command fails.
shelljs.set('-e');
shelljs.cd(PROJECT_DIR);

const targets = bazelQuery('attr(generator_function, stylelint, //...)');

console.log(`
[ Running Stylelint on ${targets.length} Targets] =>
`);

bazelTest(targets, [], { silent: false });
