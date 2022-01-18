/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { SemVer } from 'semver';
import { GitClient } from './git/git-client';
import { italic, bold, red } from 'chalk';

/** Verifies that the user is on the specified publish branch. */
export function verifyPublishBranch(version: SemVer, git: GitClient): boolean {
  const allowedBranch = getAllowedPublishBranch(version);
  const currentBranchName = git.getCurrentBranch();

  // Check if current branch matches the expected publish branch.
  if (allowedBranch !== currentBranchName) {
    throw new Error(
      red(
        `  ✘ Cannot stage release from "${italic(
          currentBranchName,
        )}". Please ` + `stage the release from "${bold(allowedBranch)}".`,
      ),
    );
  }
  return true;
}

export type VersionType = 'major' | 'minor' | 'patch';

/** Determines the allowed branch names for publishing the specified version. */
export function getAllowedPublishBranch(version: SemVer): string {
  const versionType = getSemverVersionType(version);

  if (versionType === 'major') {
    return 'master';
  } else if (versionType === 'minor') {
    return `${version.major}.x`;
  }

  return `${version.major}.${version.minor}.x`;
}

/** Determines the type of the specified Semver version. */
function getSemverVersionType(version: SemVer): VersionType {
  if (version.minor === 0 && version.patch === 0) {
    return 'major';
  } else if (version.patch === 0) {
    return 'minor';
  } else {
    return 'patch';
  }
}
