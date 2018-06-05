import { task, src, dest, SrcOptions } from 'gulp';
import { execNodeTask } from '../util/task-runner';
import { join, resolve as resolvePath } from 'path';
import { buildConfig } from '../build-config';
import { spawn } from 'child_process';
import { readFile } from 'fs';
import { red } from 'chalk';
import { sequenceTask } from '../util/sequence-task';

const gulpClean = require('gulp-clean');

const SCHEMATICS_ROOT = join(buildConfig.projectDir, 'src/schematics');
const SCHEMATICS_CONFIG_PATH = join(SCHEMATICS_ROOT, 'tsconfig.json');
const SCHEMATICS_OUTDIR = join(buildConfig.projectDir, 'node_modules', '@dynatrace', 'components-schematics');

/**
 * Spawns a child process that compiles using tsc.
 * @param flags Command-line flags to be passed to tsc.
 * @returns Promise that resolves/rejects when the child process exits.
 */
export function tscCompile(flags: string[]) {
  return new Promise((resolve, reject) => {
    const ngcPath = resolvePath('./node_modules/.bin/tsc');
    const childProcess = spawn(ngcPath, flags, {shell: true});

    // Pipe stdout and stderr from the child process.
    childProcess.stdout.on('data', (data: string|Buffer) => console.log(`${data}`));
    childProcess.stderr.on('data', (data: string|Buffer) => console.error(red(`${data}`)));
    childProcess.on('exit', (exitCode: number) => exitCode === 0 ? resolve() : reject());
  });
}

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
