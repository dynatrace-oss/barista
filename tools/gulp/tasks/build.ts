import { dest, src, task, watch } from 'gulp';
import { join } from 'path';
import { buildConfig } from '../build-config';
import { sequenceTask } from '../util/sequence-task';

import * as through from 'through2';
import { replaceVersionPlaceholders } from '../util/replace-version-placeholder';

import * as packagr from 'ng-packagr/lib/ng-v5/packagr';
import { parseDir } from 'sass-graph';

const ngPackage = () => through.obj((file, _, callback) => {
  packagr.ngPackagr()
      .forProject(file.path)
      .withTsConfig(join(buildConfig.projectDir, 'tsconfig.json'))
      .build()
      .then((result: any) => callback(null, result))
      .catch((error: any) => callback(error, null));
});

const WATCH_DEBOUNCE_DELAY = 700;

task('library:watch', () => {
  watch(join(buildConfig.libDir, '**/*'), { debounceDelay: WATCH_DEBOUNCE_DELAY }, ['library:compile', 'library:styles']);
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

task('library:styles', () => {
  const stylesGraph = parseDir(join(buildConfig.libDir, 'style'));

  return src(Object.keys(stylesGraph.index), {base: buildConfig.libDir})
    .pipe(dest(buildConfig.libOutputDir));
});

task('library:assets', () =>
  src(join(buildConfig.libDir, 'assets/**'))
    .pipe(dest(join(buildConfig.libOutputDir, 'assets')))
);

task('library:build', sequenceTask(
  'clean:lib',
  'library:compile',
  'library:styles',
  'library:assets',
  'library:version-replace',
  'library:removeModuleId'
));
