import { dest, src, task } from 'gulp';
import { join } from 'path';
import { buildConfig } from '../build-config';
import * as through from 'through2';
import { replaceVersionPlaceholders } from '../util/replace-version-placeholder';
import { execNodeTask } from '../util/task-runner';
import { sequenceTask } from '../util/sequence-task';
import { parseDir } from 'sass-graph';

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

task('library:styles', () => {
  const stylesGraph = parseDir(join(buildConfig.libDir, 'style'));

  return src(Object.keys(stylesGraph.index), {base: buildConfig.libDir})
    .pipe(dest(buildConfig.libOutputDir));
});

task('library:assets', () =>
  src(join(buildConfig.libDir, 'assets/**'))
    .pipe(dest(join(buildConfig.libOutputDir, 'assets')))
);

task('library:compile', execNodeTask('@angular/cli', 'ng', ['build', 'lib', '--prod']));

task('library:build', sequenceTask(
  'library:compile',
  'library:styles',
  'library:assets',
  'library:version-replace',
  'library:removeModuleId'
));
