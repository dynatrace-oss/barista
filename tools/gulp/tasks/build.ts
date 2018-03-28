import { dest, src, task} from 'gulp';
import { join } from 'path';
import { buildConfig } from '../build-config';
import { sequenceTask } from '../util/sequence-task';

import * as through from 'through2';
import * as sass from 'gulp-sass';
import { replaceVersionPlaceholders } from '../util/replace-version-placeholder';
import { watchFiles } from '../util/task_helpers';

import * as packagr from '@dynatrace/ng-packagr/lib/ng-v5/packagr';
// commented themes for now, lets add this as soon as we implement theming
// const themesGlob = join(buildConfig.libDir, 'core/theming/prebuilt/*.scss');

const ngPackage = () => through.obj((file, _, callback) => {
  packagr.ngPackagr()
      .forProject(file.path)
      .build()
      .then((result: any) => callback(null, result))
      .catch((error: any) => callback(error, null));
});

// task('library:themes', () =>
//   src(themesGlob)
//   .pipe(sass({
//     includePaths: ['node_modules/']
//   }).on('error', sass.logError))
//   .pipe(dest(join(buildConfig.libOutputDir, 'themes'))));

task('library:watch', () => {
  watchFiles(join(buildConfig.libDir, '**/*'), ['library:compile']);
});

task('library:version-replace', () => replaceVersionPlaceholders());

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
  /*, 'library:themes' */
));
