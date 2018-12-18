import {Version} from './parse-version';
import { red, italic, bold } from 'chalk';
import { GitClient } from './git-client';

export type VersionType = 'major' | 'minor' | 'patch';

/** Determines the type of the specified Semver version. */
export function getSemverVersionType(version: Version): VersionType {
  if (version.minor === 0 && version.patch === 0) {
    return 'major';
  } else if (version.patch === 0) {
    return 'minor';
  } else {
    return 'patch';
  }
}

/** Verifies that the user is on the specified publish branch. */
export function verifyPublishBranch(expectedPublishBranch: string, git: GitClient): boolean {
  const currentBranchName = git.getCurrentBranch();

  // Check if current branch matches the expected publish branch.
  if (expectedPublishBranch !== currentBranchName) {
    console.error(red(
      `  ✘ Cannot stage release from "${italic(currentBranchName)}". Please ` +
      `stage the release from "${bold(expectedPublishBranch)}".`));
    return false;
  }
  return true;
}
