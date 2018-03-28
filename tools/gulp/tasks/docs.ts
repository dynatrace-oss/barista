import { task } from 'gulp';
import { execNodeTask } from '../util/task_helpers';
import { sequenceTask } from '../util/sequence-task';

task('docs', sequenceTask('library:build', ['docs:serve', 'library:watch']));

task('docs:build', execNodeTask('@angular/cli', 'ng', ['build', '-a', 'docs', '--prod']));

task('docs:serve', execNodeTask('@angular/cli', 'ng', ['serve', '-a', 'docs']));
