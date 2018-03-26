import {task} from 'gulp';
import {execNodeTask} from '../util/task_helpers';

/** Glob that matches all SCSS or CSS files that should be linted. */
const stylesGlob = 'src/lib/**/!(*.bundle).+(css|scss)';

const tsGlob = 'src/lib/**/!(*.spec).ts';

task('lint', ['stylelint', 'tslint']);

task('stylelint', execNodeTask(
  'stylelint', [stylesGlob, '--config', 'stylelint-config.json', '--syntax', 'scss']
));

task('tslint', execNodeTask(
  'tslint', ['--project', 'tslint.json', tsGlob]
));
