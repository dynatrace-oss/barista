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

task('docs:generate-environment', () => {
  const deployUrl = getDeployUrl();
  return src(join(environmentsDir, 'environment.ts'))
    .pipe(deployUrl ? replaceInFile(/deployUrl:[^,]+,/gm, `deployUrl: '${deployUrl}',`) : through.obj())
    .pipe(dest(environmentsDir));
});

task('docs:compile', execNodeTask('@angular/cli', 'ng', ['build', 'docs', ...args]));

task('docs:build', sequenceTask('docs:generate-environment', 'docs:compile'));
