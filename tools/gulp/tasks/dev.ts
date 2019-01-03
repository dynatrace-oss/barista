import { dest, src, task } from 'gulp';
import { join } from 'path';
import * as through from 'through2';
import { replaceInFile } from '../util/file-replacer';
import { sequenceTask } from '../util/sequence-task';
import { execNodeTask } from '../util/task-runner';

const ARGS_TO_OMIT = 3;
const DEPLOY_URL_ARG = 'deploy-url';

const projectRoot = join(__dirname, '../../..');
const environmentsDir = join(projectRoot, 'src', 'docs', 'environments');
const args = process.argv.splice(ARGS_TO_OMIT);

const getDeployUrl = () => {
  const deployUrlArg = args.find((arg) => arg.startsWith(`--${DEPLOY_URL_ARG}=`));

  if (!deployUrlArg) {
    return undefined;
  }

  // tslint:disable-next-line no-magic-numbers
  const [, deployUrl] = deployUrlArg.split('=', 2);
  return deployUrl;
};

task('dev:set-env', () => {
  const deployUrl = getDeployUrl();
  return src(join(environmentsDir, 'environment.ts'))
    .pipe(deployUrl ? replaceInFile(/deployUrl:[^,]+,/gm, `deployUrl: '${deployUrl}',`) : through.obj())
    .pipe(dest(environmentsDir));
});

task('dev:build', execNodeTask('@angular/cli', 'ng', ['build', 'dev-app', ...args]));

task('dev:generate-app', sequenceTask('dev:set-env', 'dev:build'));
