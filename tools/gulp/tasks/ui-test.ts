import { join } from 'path';
import { task, src, dest, start } from 'gulp';
import { sequenceTask } from '../util/sequence-task';
import { buildConfig } from '../build-config';
import { ngcCompile } from '../util/ngc-compile';
import { red } from 'chalk';
import { execNodeTask } from '../util/task-runner';
import { serverTask } from '../util/http-server';

// There are no type definitions available for these imports.
const gulpConnect = require('gulp-connect');

const PROTRACTOR_CONFIG_PATH = join(buildConfig.projectDir, 'test/protractor.conf.js');

/** Glob that matches all files that need to be copied to the output folder. */
const assetsGlob = join(buildConfig.uiTestAppDir, '**/*.+(html|css|json|ts)');

task('ui-test-app:build', sequenceTask(
  process.env.SKIP_BUILD === 'true'? undefined : 'library:build',
  ['ui-test-app:copy', 'ui-test-app:copy-lib'],
  'ui-test-app:build-ts',
));

task('ui-test-app:build-ts', (done: ((err?: any) => void)) => {
  const tsConfig = join(buildConfig.uiTestAppOutputDir, 'tsconfig-build.json');
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

task('ui-test', sequenceTask(
  [':test:protractor:setup', 'serve:ui-test-app'],
  ':test:protractor',
  ':serve:ui-test-app:stop',
)).on('err', () => start(':serve:ui-test-app:stop'));

/** Task that copies all required assets to the output folder. */
task('ui-test-app:copy', () =>
  src(assetsGlob)
  .pipe(dest(buildConfig.uiTestAppOutputDir)));

/** Task that copies the compiled lib to the ui-test-app output folder */
task('ui-test-app:copy-lib', () =>
  src(join(buildConfig.libOutputDir, '**/*'))
  .pipe(dest(join(buildConfig.uiTestAppOutputDir, 'lib'))));

/** Ensures that protractor and webdriver are set up to run. */
task(':test:protractor:setup',
     execNodeTask('protractor', 'webdriver-manager', ['update', '--gecko=false']));

/** Runs protractor tests (assumes that server is already running. */
task(':test:protractor', execNodeTask('protractor', [PROTRACTOR_CONFIG_PATH]));

/** Starts up the ui-test app server. */
task(':serve:ui-test-app', serverTask(buildConfig.uiTestAppOutputDir, false));

/** Terminates the ui-test app server */
task(':serve:ui-test-app:stop', gulpConnect.serverClose);

/** Builds and serves the ui-test app. */
task('serve:ui-test-app', sequenceTask('ui-test-app:build', ':serve:ui-test-app'));
