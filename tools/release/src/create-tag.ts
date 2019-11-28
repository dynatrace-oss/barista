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
import { verifyPublishBranch } from './publish-branch';

/** Creates a new version tag based on the version in the package.json. */
function createTag(
  projectDir: string,
  repositoryOwner: string,
  repositoryName: string,
): void {
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
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const packageJsonVersion = packageJson.version;
  const version = parseVersionName(packageJsonVersion);

  if (!version || !verifyPublishBranch(version, git)) {
    process.exit(1);
  }

  if (!git.createTag(packageJsonVersion)) {
    console.error(
      red(`Could not create a Tag for version ${packageJsonVersion}`),
    );
    process.exit(1);
  }

  if (!git.pushBranchOrTagToRemote(packageJsonVersion)) {
    console.error(
      red(`Could not push Tag ${packageJsonVersion} to the remote`),
    );
    process.exit(1);
  }
}

/** Entry-point for the create tag script. */
if (require.main === module) {
  createTag(join(__dirname, '../../'), 'dynatrace-oss', 'barista');
}
