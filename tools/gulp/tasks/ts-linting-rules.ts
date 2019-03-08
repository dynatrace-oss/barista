import { task, src, dest, SrcOptions } from 'gulp';
import { join } from 'path';
import { buildConfig } from '../build-config';
import { tscCompile } from '../util/tsc-compile';
import { red } from 'chalk';
import { sequenceTask } from '../util/sequence-task';

// tslint:disable-next-line:no-var-requires no-require-imports
const gulpClean = require('gulp-clean');

const LINTING_ROOT = join(buildConfig.projectDir, 'src', 'linting');
const TS_CONFIG_PATH = join(LINTING_ROOT, 'tsconfig.json');
const LINTING_OUTDIR = join(buildConfig.libOutputDir, 'tslint');

task(':ts-linting-rules:clean', () =>
  // tslint:disable-next-line:no-object-literal-type-assertion
  src(LINTING_OUTDIR, { read: false, allowEmpty: true } as SrcOptions)
  .pipe(gulpClean(null)));

/** Runs copy tasks */
task(':ts-linting-rules:copy', () =>
  src([join(LINTING_ROOT, '**/*.json'), join(LINTING_ROOT, 'index.js')])
  .pipe(dest(LINTING_OUTDIR)));

/** Runs tsc compilation */
// tslint:disable-next-line:no-any
task(':ts-linting-rules:compile', (done: ((err?: any) => void)) => {
  tscCompile(['-p', TS_CONFIG_PATH])
  .then(() => {
    done();
  })
  .catch(() => {
    const error = red(`Failed to compile linting rules using ${TS_CONFIG_PATH}`);
    // tslint:disable-next-line:no-console
    console.error(error);

    done(error);
  });
});

task('ts-linting-rules:build', sequenceTask(':ts-linting-rules:clean', [':ts-linting-rules:copy', ':ts-linting-rules:compile']));
