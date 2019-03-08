import { task, src, dest, SrcOptions } from 'gulp';
import { join } from 'path';
import { buildConfig } from '../build-config';
import { red } from 'chalk';
import { sequenceTask } from '../util/sequence-task';
import { tscCompile } from '../util/tsc-compile';

const gulpClean = require('gulp-clean');

const SCHEMATICS_ROOT = join(buildConfig.projectDir, 'src/schematics');
const SCHEMATICS_CONFIG_PATH = join(SCHEMATICS_ROOT, 'tsconfig.json');
const SCHEMATICS_OUTDIR = join(buildConfig.projectDir, 'node_modules', '@dynatrace', 'components-schematics');

task(':schematics:clean', () =>
  src(SCHEMATICS_OUTDIR, { read: false, allowEmpty: true } as SrcOptions)
  .pipe(gulpClean(null)));

/** Runs tsc build and copy tasks */
task(':schematics:copy', () =>
  src([join(SCHEMATICS_ROOT, '**/*.json'), join(SCHEMATICS_ROOT, '*/files/**/*')])
  .pipe(dest(SCHEMATICS_OUTDIR)));

/** Runs tsc compilation */
task(':schematics:compile', (done: ((err?: any) => void)) => {
  tscCompile(['-p', SCHEMATICS_CONFIG_PATH])
  .catch(() => {
    const error = red(`Failed to compile schematics using ${SCHEMATICS_CONFIG_PATH}`);
    console.error(error);

    done(error);
  })
  .then(() => {
    done();
  });
});

task('schematics:build', sequenceTask(':schematics:clean', [':schematics:copy', ':schematics:compile']));
