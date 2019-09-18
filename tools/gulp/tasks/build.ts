import { join } from 'path';

import { red } from 'chalk';
import { dest, series, src, task } from 'gulp';
import { parseDir } from 'sass-graph';

import { buildConfig } from '../build-config';
import { replaceInFile } from '../util/file-replacer';
import { fixMetadata } from '../util/metadata-fixer';
import { replaceVersionPlaceholders } from '../util/replace-version-placeholder';
import { execNodeTask } from '../util/task-runner';
import { tscCompile } from '../util/tsc-compile';

task('library:version-replace', done => {
  replaceVersionPlaceholders();
  done();
});

task('library:removeModuleId', () =>
  src(join(buildConfig.libOutputDir, '/**/*.js'))
    .pipe(replaceInFile(/\s*moduleId:\s*module\.id\s*,?\s*/gm, ''))
    .pipe(dest(buildConfig.libOutputDir)),
);

task('library:styles', () => {
  const stylesGraph = parseDir(join(buildConfig.libDir, 'style'));

  return src(Object.keys(stylesGraph.index), { base: buildConfig.libDir }).pipe(
    dest(buildConfig.libOutputDir),
  );
});

task('library:assets', () =>
  src(join(buildConfig.libDir, 'assets/**')).pipe(
    dest(join(buildConfig.libOutputDir, 'assets')),
  ),
);

task(
  'library:compile',
  execNodeTask('@angular/cli', 'ng', ['build', 'lib', '--prod'], {}, [
    '--max_old_space_size=8192',
  ]),
);

task('library:fix-metadata', () =>
  src(
    join(
      buildConfig.libOutputDir,
      'dynatrace-angular-components.metadata.json',
    ),
  )
    .pipe(fixMetadata(join(buildConfig.libOutputDir, 'index.d.ts')))
    .pipe(dest(buildConfig.libOutputDir)),
);

/** Compiles the typescript files for the shipped schematics (ng update) */
task(':library:schematics:compile', (done: (err?: string) => void) => {
  tscCompile(['-p', join(buildConfig.libDir, 'schematics', 'tsconfig.json')])
    .catch(() => {
      const error = red(`Failed to compile lib/schematics`);
      console.error(error);

      done(error);
    })
    .then(() => {
      done();
    });
});

/** Copies the migration json file over to the dist folder for the schematics */
task(':library:schematics:copy-json', () =>
  src(join(buildConfig.libDir, 'schematics/migration.json')).pipe(
    dest(join(buildConfig.libOutputDir, 'schematics')),
  ),
);

/** Executes all tasks that need to be run to ship schematics for the library */
task(
  'library:bundle-schematics',
  series(':library:schematics:compile', ':library:schematics:copy-json'),
);

task(
  'library:build',
  series(
    'library:compile',
    'library:styles',
    'library:assets',
    'library:version-replace',
    'library:removeModuleId',
    'library:bundle-schematics',
    'library:fix-metadata',
  ),
);
