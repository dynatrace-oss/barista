import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { italic, red } from 'chalk';

import { GitClient } from './git-client';

/** Creates a release commit message for the specified version. */
export function getReleaseCommit(version: string): string {
  return `chore: bump version to ${version} w/ changelog`;
}

/**
 * Evaluates if the current commit is a release and returns its version.
 * Otherwise it returns "no-release".
 */
export function getReleaseVersionAndHash(
  projectDir: string,
  repositoryName: string,
): { version: string | null; hash: string } {
  const packageJsonPath = join(projectDir, 'package.json');
  const git = new GitClient(
    projectDir,
    `***REMOVED***
  );

  if (!existsSync(packageJsonPath)) {
    console.error(
      red(
        `The specified directory is not referring to a project directory. ` +
          `There must be a ${italic(
            'package.json',
          )} file in the project directory.`,
      ),
    );
  } else {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const packageJsonVersion = packageJson.version;
    const commit = git.getLastCommit();

    const commitParts = commit.match(/commit (\w+)/);

    if (commit) {
      return {
        version:
          commit.indexOf(getReleaseCommit(packageJsonVersion)) !== -1
            ? packageJsonVersion
            : 'no-release',
        hash: commitParts ? commitParts[1] : 'no-hash',
      };
    }
  }
  return {
    version: 'no-release',
    hash: 'no-hash',
  };
}

/** Writes the determined release version to a .version file */
export function writeReleaseVersion(projectDir: string) {
  const { version, hash } = getReleaseVersionAndHash(
    projectDir,
    'angular-components',
  );
  writeFileSync(join(projectDir, 'dist/.version'), version, 'utf-8');
  writeFileSync(join(projectDir, 'dist/.commit_hash'), hash, 'utf-8');
}

/** Entry-point for the release version determination script. */
if (require.main === module) {
  writeReleaseVersion(join(__dirname, '../../'));
}
