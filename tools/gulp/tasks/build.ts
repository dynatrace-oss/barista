import { dest, src, task} from 'gulp';
import { join } from 'path';
import { buildConfig } from '../build-config';
import { sequenceTask } from '../util/sequence-task';

import * as through from 'through2';
import * as sass from 'gulp-sass';

const packagr = require('@dynatrace/ng-packagr/lib/ng-v5/packagr');

const themesGlob = join(buildConfig.libDir, 'core/theming/prebuilt/*.scss');

const ngPackage = () => through.obj((file, _, callback) => {
  packagr.ngPackagr()
      .forProject(file.path)
      .build()
      .then((result: any) => callback(null, result))
      .catch((error: any) => callback(error, null));
});

task('library:themes', () =>
  src(themesGlob)
  .pipe(sass({
    includePaths: ['node_modules/']
  }).on('error', sass.logError))
  .pipe(dest(join(buildConfig.libOutputDir, 'themes'))));

task('library:prepare-build', sequenceTask('clean', 'library:themes'));

task('library:build', ['library:prepare-build'], () =>
  src('src/lib/package.json', {
    read: false,
  })
  .pipe(ngPackage())
);
