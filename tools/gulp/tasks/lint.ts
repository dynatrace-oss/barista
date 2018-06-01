import {task} from 'gulp';
import { execNodeTask } from '../util/task-runner';

/** Glob that matches all SCSS or CSS files that should be linted. */
const stylesGlob = 'src/lib/**/!(*.bundle).+(css|scss)';

const tsGlob = 'src/lib/**/!(*.spec).ts';
const tsSpecsGlob = 'src/lib/**/*.spec.ts';
const tsDocs = 'src/docs/**/!(*.spec).ts';

task('lint', ['stylelint', 'tslint', 'tslint:specs', 'tslint:docs']);

task('stylelint', execNodeTask(
  'stylelint', [stylesGlob, '--config', 'stylelint-config.json', '--syntax', 'scss'],
));

task('tslint', execNodeTask(
  'tslint', ['--project', 'tsconfig.json', tsGlob],
));

task('tslint:specs', execNodeTask(
  'tslint', ['--config', 'tslint.spec.json', '--project', 'tsconfig.json', tsSpecsGlob],
));

task('tslint:docs', execNodeTask(
  'tslint', ['--project', 'src/docs/tsconfig.json', tsDocs],
));
