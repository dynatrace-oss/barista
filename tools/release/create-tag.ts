import { join } from 'path';
import { GitClient } from './git-client';
import { existsSync, readFileSync } from 'fs';
import { italic, red } from 'chalk';
import { verifyPublishBranch } from './publish-branch';

/** Creates a new version tag based on the version in the package.json. */
function createTag(projectDir: string, repositoryName: string) {
  const packageJsonPath = join(projectDir, 'package.json');
  const git = new GitClient(projectDir, `***REMOVED***

  if (!existsSync(packageJsonPath)) {
    console.error(red(`The specified directory is not referring to a project directory. ` +
      `There must be a ${italic('package.json')} file in the project directory.`));
    process.exit(1);
  }

  if (!verifyPublishBranch('master', git)) {
    process.exit(1);
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const packageJsonVersion = packageJson.version;

  if (!git.createTag(packageJsonVersion)) {
    console.error(red(`Could not create a Tag for version ${packageJsonVersion}`));
    process.exit(1);
  }

  if (!git.pushBranchOrTagToRemote(packageJsonVersion)) {
    console.error(red(`Could not push Tag ${packageJsonVersion} to the remote`));
    process.exit(1);
  }
}

/** Entry-point for the create tag script. */
if (require.main === module) {
  createTag(join(__dirname, '../../'), 'angular-components');
}
