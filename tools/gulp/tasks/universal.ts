import { task, src, dest } from 'gulp';
import { execTask, tsBuildTask } from '../util/task_helpers';
import { join } from 'path';
import { buildConfig } from '../build-config';
import { sequenceTask } from '../util/sequence-task';
import { ngcCompile } from '../util/ngc-compile';
import { red } from 'chalk';

const tsconfigAppPath = join(buildConfig.universalAppOutputDir, 'tsconfig-build.json');
const tsconfigPrerenderPath = join(buildConfig.universalAppOutputDir, 'tsconfig-prerender.json');

/** Path to the compiled prerender file. Running this file just dumps the HTML output for now. */
const prerenderOutFile = join(buildConfig.universalAppOutputDir, 'prerender.js');

/** Task that builds the universal-app and runs the prerender script. */
task('universal', ['universal:build'], execTask(
  // Runs node with the tsconfig-paths module to alias the @dynatrace/ngx-groundhog dependency.
  'node', ['-r', 'tsconfig-paths/register', prerenderOutFile], {
    env: {TS_NODE_PROJECT: tsconfigPrerenderPath},
    // Errors in lifecycle hooks will write to STDERR, but won't exit the process with an
    // error code, however we still want to catch those cases in the CI.
    failOnStderr: true
  }
));

task('universal:build', sequenceTask(
  'clean',
  'library:build',
  ['universal:copy-lib', 'universal:copy-files'],
  'universal:build-app-ts',
  'universal:build-prerender-ts'
));

/** Task that builds the universal app in the output directory. */
task('universal:build-app-ts', (done) => {
  ngcCompile(['-p', tsconfigAppPath]).catch(() => {
    const error = red(`Failed to compile lib using ${tsconfigAppPath}`);
    console.error(error);
    return Promise.reject(error);
  }).then(() => {
    done();
  });
});

/** Task that copies all files to the output directory. */
task('universal:copy-files', () =>
  src(join(buildConfig.universalAppDir, '**/*'))
  .pipe(dest(buildConfig.universalAppOutputDir)));

/** Task that builds the prerender script in the output directory. */
task('universal:build-prerender-ts', tsBuildTask(tsconfigPrerenderPath));

task('universal:copy-lib', () =>
  src(join(buildConfig.libOutputDir, '**/*'))
  .pipe(dest(join(buildConfig.universalAppOutputDir, 'lib'))));
