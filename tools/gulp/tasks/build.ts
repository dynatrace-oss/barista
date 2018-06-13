import { dest, src, task } from 'gulp';
import { join } from 'path';
import { buildConfig } from '../build-config';
import * as through from 'through2';
import { replaceVersionPlaceholders } from '../util/replace-version-placeholder';
import { execNodeTask } from '../util/task-runner';

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

task('library:compile', execNodeTask('@angular/cli', 'ng', ['build', 'lib']));
