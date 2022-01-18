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
import { getAllowedPublishBranch } from '../publish-branch';
import { GitClient } from '../git';

/** Creates a release commit message for the specified version. */
export function getReleaseCommit(version: string): string {
  return `chore: Bump version to ${version} w/ changelog`;
}

/**
 * Evaluates if the current commit is a release and returns its version.
 * Otherwise it returns "no-release".
 */
export function shouldRelease(git: GitClient, version: SemVer): boolean {
  if (version) {
    const branch = git.getCurrentBranch();
    const allowedBranch = getAllowedPublishBranch(version);

    const commit = git.getLastCommit();
    return (
      Boolean(branch) &&
      branch === allowedBranch &&
      Boolean(commit) &&
      commit.indexOf(getReleaseCommit(version.format())) !== -1
    );
  }
  return false;
}
