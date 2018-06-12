import { task } from 'gulp';
import { execNodeTask } from '../util/task-runner';
import { sequenceTask } from '../util/sequence-task';

task('docs', sequenceTask('library:compile', 'docs:serve'));

task('docs:serve', execNodeTask('@angular/cli', 'ng', ['serve', 'docs']));
