/**
 * @license
 * Based on the build of angular/material2 by Google Inc. governed by an
 * MIT-style license that can be found in the LICENSE file at https://angular.io/license
 */

import { src, task } from 'gulp';
import { buildConfig } from '../build-config';

const gulpClean = require('gulp-clean');

const cleanTask = (dir: string) =>
  src(dir, { read: false, allowEmpty: true })
    .pipe(gulpClean(null));

/** Deletes the dist/ directory. */
task('clean:universal', () => cleanTask(buildConfig.universalAppOutputDir));
