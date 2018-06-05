import { join } from 'path';
import { task, watch, src, dest, WatchCallback } from 'gulp';
import { sequenceTask } from '../util/sequence-task';
import { buildConfig } from '../build-config';
import { ngcCompile } from '../util/ngc-compile';
import { red } from 'chalk';

// Default Karma options.
const defaultOptions = {
  configFile: join(buildConfig.projectDir, 'test/karma.conf.js'),
  autoWatch: false,
  singleRun: false,
};

task('test:build', process.env.SKIP_BUILD === 'true'? []: ['library:build'], (done) => {
  const tsConfig = join(buildConfig.libDir, 'tsconfig-test.json');
  ngcCompile(['-p', tsConfig])
  .catch(() => {
    const error = red(`Failed to compile lib using ${tsConfig}`);
    console.error(error);

    done(error);
  })
  .then(() => {
    done();
  });
});

/**
 * Runs the unit tests. Does not watch for changes.
 * This task should be used when running tests on the CI server.
 */
task('test:single-run', ['test:build'], (done: () => void) => {
  // Load karma not outside. Karma pollutes Promise with a different implementation.
  const karma = require('karma');

  new karma.Server({
    ...defaultOptions,
    singleRun: true,
  },               (exitCode: number) => {
    exitCode === 0 ? done() : process.exit(exitCode);
  }).start();
});

/**
 * [Watch task] Runs the unit tests, rebuilding and re-testing when sources change.
 * This task should be used when running unit tests locally.
 */
task('test', ['test:build'], karmaWatchTask({ browsers: ['Chrome'] }));

/**
 * Returns a Gulp task that spawns a Karma server and reloads whenever the files change.
 * Note that this doesn't use Karma's built-in file watching. Due to the way our build
 * process is set up, Karma ends up firing it's change detection for every file that is
 * written to disk, which causes it to run tests multiple time and makes it hard to follow
 * the console output. This approach runs the Karma server and then depends on the Gulp API
 * to tell Karma when to run the tests.
 * @param overrides Karma options to use on top of the defaults.
 */
function karmaWatchTask(options?: any) {
  return () => {
    const patternRoot = join(buildConfig.libDir, '**/*');
    // Note: Karma shouldn't be required from the outside, because it
    // pollutes the global Promise with a custom implementation.
    const karma = require('karma');

    // Configure the Karma server and override the autoWatch and singleRun just in case.
    const server = new karma.Server({...defaultOptions, ...options});

    // Refreshes Karma's file list and schedules a test run.
    // Tests will only run if TypeScript compilation was successful.
    const runTests = (error?: Error) => {
      if (!error) {
        server.refreshFiles()
        .then(() => server._injector.get('executor')
        .schedule());
      }
    };

    // Boot up the test server and run the tests whenever a new browser connects.
    server.start();
    server.on('browser_register', runTests());

    // Whenever a file change has been recognized, rebuild and re-run the tests.
    watch(`${patternRoot}.+(ts|scss|html)`, () => runTests());
  };
}
