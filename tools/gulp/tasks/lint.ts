import {task} from 'gulp';
import {execNodeTask} from '../util/task-runner';
import {buildConfig} from '../build-config';
import {join} from "path";
import {createWriteStream} from 'fs';
import {ensureDirSync} from 'fs-extra';
import Orchestrator = require("orchestrator");

/** Glob that matches all SCSS or CSS files that should be linted. */
const stylesGlob = 'src/lib/**/!(*.bundle).+(css|scss)';

const tsGlob = 'src/lib/**/!(*.spec).ts';
const tsSpecsGlob = 'src/lib/**/*.spec.ts';
const tsDocs = 'src/docs/**/!(*.spec).ts';
const tsUiTestApp = 'src/ui-test-app/**/!(*.spec).ts';
const tsUniversalApp = 'src/universal-app/**/!(*.spec).ts';
const tsUiSpecsGlob = 'ui-tests/**/*.spec.ts';

const lintOutDir = join(buildConfig.outputDir,'checkstyle');
const stylelintOutFile = join(lintOutDir, 'stylelint.xml');

const ciArgs = ['--format', 'checkstyle', '--out'];

const stylelintArgs = [stylesGlob, '--config', 'stylelint-config.json', '--syntax', 'scss'];
const ciStylelintArgs = [...stylelintArgs, '--custom-formatter', 'node_modules/stylelint-junit-formatter/index.js', ];

const lintArgs = ['--project', 'tsconfig.json', tsGlob];
const ciLintArgs = [...lintArgs, ...ciArgs, join(lintOutDir, 'checkstyle.xml')];

const specLintArgs = ['--config', 'tslint.spec.json', '--project', 'tsconfig.json', tsSpecsGlob];
const ciSpecLintArgs = [...specLintArgs, ...ciArgs, join(lintOutDir, 'checkstyle-spec.xml')];

const docsLintArgs = ['--project', 'src/docs/tsconfig.json', tsDocs];
const ciDocsLintArgs = [...docsLintArgs, ...ciArgs, join(lintOutDir, 'checkstyle-docs.xml')];

const uiTestAppLintArgs = ['--project', 'src/ui-test-app/tsconfig.json', tsUiTestApp];
const ciUiTestAppLintArgs = [...uiTestAppLintArgs, ...ciArgs, join(lintOutDir, 'checkstyle-ui-test-app.xml')];

const universalLintArgs = ['--project', 'src/universal-app/tsconfig.json', tsUniversalApp];
const ciUniversalLintArgs = [...universalLintArgs, ...ciArgs, join(lintOutDir, 'checkstyle-universal.xml')];

const uiTestLintArgs = ['--config', 'tslint.spec.json', '--project', 'ui-tests/tsconfig.json', tsUiSpecsGlob];
const ciUiTestLintArgs = [...uiTestLintArgs, ...ciArgs, join(lintOutDir, 'checkstyle-ui-test.xml')]


task('lint', [
  'stylelint',
  'tslint',
  'tslint:specs',
  'tslint:docs',
  'tslint:ui-test-app',
  'tslint:universal-app',
  'tslint:ui-tests',
]);

task('ensureOutDirectory', () => {
  ensureDirSync(buildConfig.outputDir);
  ensureDirSync(lintOutDir);
});

task('stylelint', ['ensureOutDirectory'],
  process.env.CI === 'true' ? executeStylelintOnCI : execNodeTask('stylelint', stylelintArgs));

function executeStylelintOnCI(done: (err?: any) => void) {
  const file = createWriteStream(stylelintOutFile);
  execNodeTask(
    'stylelint', ciStylelintArgs, undefined, {
      silentStdout: true,
      stdoutListener: (data: string) => file.write(data),
    }
  )((err?: any) => {
      done(err);
      file.end();
    }
  );
}

task('tslint', ['ensureOutDirectory'], execNodeTask(
  'tslint', process.env.CI==='true' ? ciLintArgs : lintArgs,
));

task('tslint:specs', ['ensureOutDirectory'], execNodeTask(
  'tslint', process.env.CI==='true' ? ciSpecLintArgs : specLintArgs,
));

task('tslint:docs', ['ensureOutDirectory'], execNodeTask(
  'tslint', process.env.CI==='true' ? ciDocsLintArgs : docsLintArgs,
));

task('tslint:ui-test-app', ['ensureOutDirectory'], execNodeTask(
  'tslint', process.env.CI==='true' ? ciUiTestAppLintArgs : uiTestAppLintArgs,
));

task('tslint:universal-app', ['ensureOutDirectory'], execNodeTask(
  'tslint', process.env.CI==='true' ? ciUniversalLintArgs : universalLintArgs,
));

task('tslint:ui-tests', ['ensureOutDirectory'], execNodeTask(
  'tslint', process.env.CI==='true' ? ciUiTestLintArgs : uiTestLintArgs,
));
