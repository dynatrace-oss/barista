/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */

import { src, task, SrcOptions } from 'gulp';
import { buildConfig } from '../build-config';

const gulpClean = require('gulp-clean');

/** Deletes the dist/ directory. */
task('clean:universal', () =>
  src(buildConfig.universalAppOutputDir, { read: false, allowEmpty: true } as SrcOptions)
  .pipe(gulpClean(null)));

  task('clean:lib', () =>
  src(buildConfig.libOutputDir, { read: false, allowEmpty: true } as SrcOptions)
  .pipe(gulpClean(null)));