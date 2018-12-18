import { dest, src, task } from 'gulp';
import { join } from 'path';
import { buildConfig } from '../build-config';
import { replaceInFile } from '../util/file-replacer';
import { fixMetadata } from '../util/metadata-fixer';
import { replaceVersionPlaceholders } from '../util/replace-version-placeholder';
import { execNodeTask } from '../util/task-runner';
import { sequenceTask } from '../util/sequence-task';
import { parseDir } from 'sass-graph';

task('library:version-replace', replaceVersionPlaceholders);

task('library:removeModuleId', () =>
  src(join(buildConfig.libOutputDir, '/**/*.js'))
  .pipe(replaceInFile(/\s*moduleId:\s*module\.id\s*,?\s*/gm, ''))
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

task('library:compile', execNodeTask('@angular/cli', 'ng', ['build', 'lib', '--prod'], {}, ['--max_old_space_size=8192']));

task('library:fix-metadata', () =>
  src(join(buildConfig.libOutputDir, 'dynatrace-angular-components.metadata.json'))
    .pipe(fixMetadata(join(buildConfig.libOutputDir, 'index.d.ts')))
    .pipe(dest(buildConfig.libOutputDir)));

task('library:build', sequenceTask(
  'library:compile',
  'library:styles',
  'library:assets',
  'library:version-replace',
  'library:removeModuleId',
  'library:fix-metadata'
));
