import { task } from 'gulp';
import { execNodeTask } from '../util/task-runner';
import { sequenceTask } from '../util/sequence-task';

task('docs', sequenceTask('library:build', ['docs:serve', 'library:watch']));

// removed --prod flag until ***REMOVED*** is resolved
task('docs:build', execNodeTask('@angular/cli', 'ng', ['build', '-a', 'docs']));

task('docs:serve', execNodeTask('@angular/cli', 'ng', ['serve', '-a', 'docs']));
