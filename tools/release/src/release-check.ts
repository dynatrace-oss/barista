/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { italic, red } from 'chalk';

import { GitClient } from './git/git-client';
import { parseVersionName } from './parse-version';
import { getAllowedPublishBranch } from './publish-branch';

/** Creates a release commit message for the specified version. */
export function getReleaseCommit(version: string): string {
  return `chore: Bump version to ${version} w/ changelog`;
}

/**
 * Evaluates if the current commit is a release and returns its version.
 * Otherwise it returns "no-release".
 */
export function shouldRelease(
  projectDir: string,
  repositoryOwner: string,
  repositoryName: string,
): boolean {
  const packageJsonPath = join(projectDir, 'package.json');
  const git = new GitClient(
    projectDir,
    `https://github.com/${repositoryOwner}/${repositoryName}.git`,
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
    process.exit(1);
  } else {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const packageJsonVersion = packageJson.version;
    const version = parseVersionName(packageJsonVersion);
    if (version) {
      // CI exposes branch name of triggered build.
      // It checks out a detached HEAD so we can not
      // grab the branch name from git
      const branch = process.env.BRANCH_NAME;
      const allowedBranch = getAllowedPublishBranch(version);

      const commit = git.getLastCommit();

      return (
        Boolean(branch) &&
        branch === allowedBranch &&
        Boolean(commit) &&
        commit.indexOf(getReleaseCommit(packageJsonVersion)) !== -1
      );
    }
  }
  return false;
}

/** Entry-point for the release version determination script. */
if (require.main === module) {
  console.log(
    shouldRelease(join(__dirname, '../../../'), 'dynatrace-oss', 'barista'),
  );
  process.exit(0);
}
