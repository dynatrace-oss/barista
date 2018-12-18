import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { red, italic } from 'chalk'
import { GitClient } from './git-client';
import { verifyPublishBranch } from './publish-branch';

/** Creates a release commit message for the specified version. */
export function getReleaseCommit(version: string): string {
  return `chore: bump version to ${version} w/ changelog`;
}

/**
 * Evaluates if the current commit is a release and returns its version.
 * Otherwise it returns "no-release".
 */
export function getReleaseVersion(projectDir: string, repositoryName: string): string | 'no-release' {
  const packageJsonPath = join(projectDir, 'package.json');
  const git = new GitClient(projectDir, `***REMOVED***

  if (!existsSync(packageJsonPath)) {
    console.error(red(`The specified directory is not referring to a project directory. ` +
      `There must be a ${italic('package.json')} file in the project directory.`));
  } else {
    // Releasing is only allowed on master
    if (!verifyPublishBranch('master', git)) {
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

/** Writes the determined release version to a .version file */
export function writeReleaseVersion(projectDir: string) {
  const releaseVersion = getReleaseVersion(projectDir, 'angular-components');
  writeFileSync(join(projectDir, 'dist/.version'), releaseVersion, 'utf-8');
}

/** Entry-point for the release version determination script. */
if (require.main === module) {
  writeReleaseVersion(join(__dirname, '../../'));
}
