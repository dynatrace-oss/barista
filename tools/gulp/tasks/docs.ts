/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */

import { task, src, dest } from 'gulp';
import { join } from 'path';
import { tsBuildTask, serverTask, watchFiles } from '../util/task_helpers';
import { buildConfig } from '../build-config';
import { sequenceTask } from '../util/sequence-task';

// These imports lack of type definitions.
const gulpSass = require('gulp-sass');

/** Array of vendors that are required to serve the docs */
const appVendors = [
  '@angular',
  'systemjs',
  'zone.js',
  'rxjs',
  'core-js',
  'web-animations-js',
  'tslib',
];

/** Glob that matches all required vendors for the docs. */
const vendorGlob = `+(${appVendors.join('|')})/**/*.+(html|css|js|map)`;

/** Path to the directory where all bundles live. */
const bundlesDir = join(buildConfig.libOutputDir, 'bundles');

const appDir = join(buildConfig.projectDir, 'src', 'docs');
const outDir = join(buildConfig.outputDir, 'docs');

/** Glob that matches all assets that need to be copied to the output. */
const assetsGlob = join(appDir, `**/*.+(html|css|svg|png|ico|woff|ttf)`);

task(':watch:docs', () => {
  watchFiles(join(appDir, '**/*.ts'), [':build:docs:ts']);
  watchFiles(join(appDir, '**/*.scss'), [':build:docs:scss']);
  watchFiles(join(appDir, '**/*.html'), [':build:docs:assets']);

  // Custom watchers for all packages that are used inside of the docs.
  watchFiles(join(buildConfig.libDir, '**/*'), ['library:build']);
});

/** Path to the demo-app tsconfig file. */
const tsconfigPath = join(appDir, 'tsconfig-build.json');

task(':build:docs:ts', tsBuildTask(tsconfigPath));
task(':build:docs:scss', () =>
  src(join(appDir, '**/*.scss'))
  .pipe(gulpSass({
    // We need to include node_modules to the includePaths
    // so we can @import from @angular/cdk/...
    includePaths: ['node_modules/']
  }).on('error', gulpSass.logError))
  // .pipe(gulpIf(minifyOutput, gulpCleanCss()))
  .pipe(dest(outDir)));

task(':build:docs:assets', () => 
  src(assetsGlob)
  .pipe(dest(outDir)));

task(':serve:docs', serverTask(outDir, true));

task('build:docs', sequenceTask(
  'library:build',
  [':build:docs:assets', ':build:docs:scss', ':build:docs:ts']
));

task('serve:docs', ['build:docs'], sequenceTask([':serve:docs', ':watch:docs']));
