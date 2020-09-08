const shelljs = require('shelljs');
const { EOL } = require('os');
// const { getNativeBinary } = require('@bazel/bazelisk/bazelisk.js');
// Bazel binary
const BAZEL_BINARY = 'bazel'; //getNativeBinary();

// Common bazel flags
const COMMON_FLAGS = [
  `--show_progress_rate_limit=5`,
  `--curses=yes`,
  `--color=yes`,
  `--terminal_columns=${process.stdout.columns}`,
  `--verbose_failures`,
];

/**
 *
 * @param {string[]} cmd
 * @param {Object} options
 * @param {boolean} options.silent
 * @return {string}
 */
function executeBazel(cmd = [], options = { silent: true }) {
  const execOptions = {
    silent: options.silent,
  };
  return shelljs.exec([BAZEL_BINARY, ...cmd].join(' '), execOptions).toString();
}

/**
 *
 * @param {string[]} targets
 * @param {string[]} flags
 * @param {Object} options
 * @param {boolean} options.silent
 * @return {string}
 */
function bazelTest(targets, flags = [], options = undefined) {
  const aggregated_flags = [
    ...COMMON_FLAGS,
    '--flaky_test_attempts=3',
    '--build_tests_only',
    ...flags,
  ];

  return executeBazel(['test', ...aggregated_flags, '--', ...targets], options);
}

/**
 *
 * @param {string} targets
 * @return {string[]}
 */
function bazelQuery(query) {
  return executeBazel([
    '--nomaster_bazelrc',
    '--bazelrc=/dev/null',
    'query',
    `"${query}"`,
  ])
    .trim()
    .split(EOL)
    .filter((s) => s.startsWith('//'));
}

module.exports = executeBazel;
module.exports.executeBazel = executeBazel;
module.exports.bazelTest = bazelTest;
module.exports.bazelQuery = bazelQuery;
