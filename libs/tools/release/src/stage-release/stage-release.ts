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

import {
  PackageJson,
  PackageLockJson,
  tryJsonParse,
} from '@dynatrace/shared/node';
import { Octokit } from '@octokit/rest';
import { bold, cyan, green, italic, red, yellow } from 'chalk';
import { promises as fs } from 'fs';
import { join } from 'path';
import { SemVer } from 'semver';
import {
  CHANGELOG_FILE_NAME,
  prependChangelogFromLatestTag,
} from '../changelog';
import {
  GitClient,
  verifyLocalCommitsMatchUpstream,
  verifyNoUncommittedChanges,
  verifyPassingGithubStatus,
} from '../git';
import { promptForNewVersion } from '../version';
import { promptConfirm } from '../prompts';
import { getAllowedPublishBranch } from '../publish-branch';
import {
  ABORT_RELEASE,
  getReleaseCommit,
  GET_BRANCH_SWITCH_ERROR,
  GET_FAILED_CREATE_STAGING_BRANCH_ERROR,
  GET_PUSH_RELEASE_BRANCH_ERROR,
  parsePackageVersion,
} from '../utils';
import { exec } from 'child_process';
import { platform } from 'process';

export async function stageRelease(
  workspaceRoot: string,
  headerPartialPath: string,
): Promise<void> {
  console.log();
  console.log(cyan('-----------------------------------------------------'));
  console.log(cyan('  Dynatrace Angular Components stage release script'));
  console.log(cyan('-----------------------------------------------------'));
  console.log();

  // Instance of a wrapper that can execute Git commands.
  const gitClient = new GitClient(workspaceRoot);

  // Octokit API instance that can be used to make Github API calls.
  const githubApi = new Octokit();

  // determine version
  const currentVersion = await parsePackageVersion(workspaceRoot);
  const packageJsonPath = join(workspaceRoot, 'package.json');
  const packageJson = await tryJsonParse<PackageJson>(packageJsonPath);
  const packageLockJsonPath = join(workspaceRoot, 'package-lock.json');
  const packageLockJson = await tryJsonParse<PackageLockJson>(
    packageLockJsonPath,
  );

  const newVersion = await promptForNewVersion(currentVersion);
  const newVersionName = newVersion.raw!;
  const needsVersionBump = newVersion.compare(currentVersion) !== 0;
  const stagingBranch = `release-stage/${newVersionName}`;

  verifyNoUncommittedChanges(gitClient);

  // Branch that will be used to stage the release for the
  // new selected version.
  const publishBranch = switchToPublishBranch(gitClient, newVersion);

  verifyLocalCommitsMatchUpstream(gitClient, publishBranch);
  await verifyPassingGithubStatus(gitClient, githubApi, publishBranch);

  if (!gitClient.checkoutNewBranch(stagingBranch)) {
    throw new Error(GET_FAILED_CREATE_STAGING_BRANCH_ERROR(stagingBranch));
  }

  if (needsVersionBump) {
    await updatePackageJsonVersion(
      packageJson,
      packageJsonPath,
      newVersionName,
    );

    await updatePackageJsonVersion(
      packageLockJson,
      packageLockJsonPath,
      newVersionName,
    );

    console.log(
      green(
        `  ✓   Updated the version to "${bold(
          newVersionName,
        )}" inside of the ${italic('package.json')}`,
      ),
    );
    console.log();
  }

  await prependChangelogFromLatestTag(
    join(workspaceRoot, CHANGELOG_FILE_NAME),
    headerPartialPath,
  );

  console.log();
  console.log(
    green(`  ✓   Updated the changelog in "${bold(CHANGELOG_FILE_NAME)}"`),
  );
  console.log(
    yellow(
      `  ⚠   Please review CHANGELOG.md and ensure that the log ` +
        `contains only changes that apply to the public library release. ` +
        `When done, proceed to the prompt below.`,
    ),
  );
  console.log();

  if (
    !(await promptConfirm('Do you want to proceed and commit the changes?'))
  ) {
    throw new Error(yellow(ABORT_RELEASE));
  }

  gitClient.stageAllChanges();

  if (needsVersionBump) {
    gitClient.createNewCommit(getReleaseCommit(newVersionName));
  } else {
    gitClient.createNewCommit(`chore: Update changelog for ${newVersionName}`);
  }

  console.info();
  console.info(
    green(`  ✓   Created the staging commit for: "${newVersionName}".`),
  );
  console.info();

  // Pushing
  if (!gitClient.pushBranchOrTagToRemote(stagingBranch)) {
    throw new Error(red(GET_PUSH_RELEASE_BRANCH_ERROR(stagingBranch)));
  }
  console.info(
    green(`  ✓   Pushed release staging branch "${stagingBranch}" to remote.`),
  );

  console.info(
    green(`  ✓   Everything is ready please create a pull request on github.`),
  );

  // Open the compare view on github, to easily create a pull request for the staged release
  const prurl = `https://github.com/dynatrace-oss/barista/compare/${stagingBranch}?expand=1`;
  const start =
    platform === 'darwin'
      ? 'open'
      : platform === 'win32'
      ? 'start'
      : 'xdg-open';
  exec(`${start} ${prurl}`);
}

/**
 * Checks if the user is on an allowed publish branch
 * for the specified version.
 */
function switchToPublishBranch(git: GitClient, newVersion: SemVer): string {
  const allowedBranch = getAllowedPublishBranch(newVersion);
  const currentBranchName = git.getCurrentBranch();

  // If current branch already matches one of the allowed publish branches,
  // just continue by exiting this function and returning the currently
  // used publish branch.
  if (allowedBranch === currentBranchName) {
    console.log(
      green(`  ✓   Using the "${italic(currentBranchName)}" branch.`),
    );
    return currentBranchName;
  } else {
    if (!git.checkoutBranch(allowedBranch)) {
      throw new Error(red(GET_BRANCH_SWITCH_ERROR(allowedBranch)));
    }

    console.log(
      green(`  ✓   Switched to the "${italic(allowedBranch)}" branch.`),
    );
  }
  return allowedBranch;
}

/**
 * Updates the version of the project package.json and
 * writes the changes to disk.
 */
async function updatePackageJsonVersion(
  packageJson: PackageJson | PackageLockJson,
  packageJsonPath: string,
  newVersionName: string,
): Promise<void> {
  const newPackageJson = { ...packageJson, version: newVersionName };
  await fs.writeFile(
    packageJsonPath,
    `${JSON.stringify(newPackageJson, null, 2)}\n`,
  );
}
