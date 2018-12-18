import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { red, italic } from 'chalk'
import { GitClient } from './git-client';
import { verifyPublishBranch } from './publish-branch';

/** Creates a release commit message for the specified version. */
export function getReleaseCommit(version: string): string {
  return `chore: bump version to ${version} w/ changelog`;
}

/**
 * Evaluates if the current commit is a release and returns its version.
 * Otherwise it returns no-release.
 */
export function getReleaseVersion(projectDir: string, repositoryName: string): string | 'no-release' {
  const packageJsonPath = join(projectDir, 'package.json');
  const git = new GitClient(projectDir, `***REMOVED***

  if (!existsSync(packageJsonPath)) {
    console.error(red(`The specified directory is not referring to a project directory. ` +
      `There must be a ${italic('package.json')} file in the project directory.`));
  } else {
    // Releasing is only allowed on master
    if (!verifyPublishBranch('master', this.git)) {
      return 'no-release';
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const packageJsonVersion = packageJson.version;
    const commit = git.getLastCommit();

    if (commit && commit.indexOf(getReleaseCommit(packageJsonVersion)) !== -1) {
      return packageJsonVersion;
    }
  }

  return 'no-release';
}

/** Entry-point for the release staging script. */
if (require.main === module) {
  console.log(getReleaseVersion(join(__dirname, '../../'), 'angular-components'));
}
