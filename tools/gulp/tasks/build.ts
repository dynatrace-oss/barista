import { dest, src, task, watch } from 'gulp';
import { join } from 'path';
import { buildConfig } from '../build-config';
import { sequenceTask } from '../util/sequence-task';

import * as through from 'through2';
import * as sass from 'gulp-sass';
import { replaceVersionPlaceholders } from '../util/replace-version-placeholder';

import * as packagr from '@dynatrace/ng-packagr/lib/ng-v5/packagr';

const ngPackage = () => through.obj((file, _, callback) => {
  packagr.ngPackagr()
      .forProject(file.path)
      .build()
      .then((result: any) => callback(null, result))
      .catch((error: any) => callback(error, null));
});

const WATCH_DEBOUNCE_DELAY = 700;

task('library:watch', () => {
  watch(join(buildConfig.libDir, '**/*'), { debounceDelay: WATCH_DEBOUNCE_DELAY }, ['library:compile']);
});

task('library:version-replace', replaceVersionPlaceholders);

// module.id needs to be removed to work with the aot compiler
const removeModuleId = () => through.obj((file, _, callback) => {
  if (file.isNull()) {
    callback(null);

    return;
  }
  const contentStr = file.contents.toString('utf8');
  file.contents = Buffer.from(contentStr.replace(/\s*moduleId:\s*module\.id\s*,?\s*/gm, ''));
  callback(null, file);
});

task('library:removeModuleId', () =>
  src(join(buildConfig.libOutputDir, '/**/*.js'))
  .pipe(removeModuleId())
  .pipe(dest(buildConfig.libOutputDir)));

task('library:compile', () =>
  src(join(buildConfig.libDir, 'package.json'), {
    read: false,
  })
  .pipe(ngPackage()));

task('library:build', sequenceTask(
  'clean:lib',
  'library:compile',
  'library:version-replace',
  'library:removeModuleId',
));
