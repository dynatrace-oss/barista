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

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { bold, cyan, green, italic, red, yellow } from 'chalk';
import { prompt } from 'inquirer';
import * as OctokitApi from '@octokit/rest';

import { promptAndGenerateChangelog } from './changelog';
import { getReleaseCommit } from './release-check';
import { GitClient } from './git/git-client';
import { getGithubBranchCommitsUrl } from './git/github-urls';
import { promptForNewVersion } from './new-version-prompt';
import { Version, parseVersionName } from './parse-version';
import { getAllowedPublishBranch } from './publish-branch';

/** Default filename for the changelog. */
const CHANGELOG_FILE_NAME = 'CHANGELOG.md';

class StageReleaseTask {
  /** Path to the project package JSON. */
  packageJsonPath: string;

  /** Serialized package.json of the specified project. */
  packageJson: any;

  /** Parsed current version of the project. */
  currentVersion: Version;

  /** Instance of a wrapper that can execute Git commands. */
  git: GitClient;

  /** Octokit API instance that can be used to make Github API calls. */
  githubApi: OctokitApi;

  constructor(
    public projectDir: string,
    public repositoryOwner: string,
    public repositoryName: string,
  ) {
    this.packageJsonPath = join(projectDir, 'package.json');

    if (!existsSync(this.packageJsonPath)) {
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

    this.packageJson = JSON.parse(readFileSync(this.packageJsonPath, 'utf-8'));
    this.currentVersion = parseVersionName(this.packageJson.version)!;

    if (!this.currentVersion) {
      console.error(
        red(
          `Cannot parse current version in ${italic('package.json')}. Please ` +
            `make sure "${this.packageJson.version}" is a valid ` +
            `Semver version.`,
        ),
      );
      process.exit(1);
    }

    this.git = new GitClient(
      projectDir,
      `https://github.com/${repositoryOwner}/${repositoryName}.git`,
    );
    this.githubApi = new OctokitApi();
  }

  async run(): Promise<void> {
    console.log();
    console.log(cyan('-----------------------------------------------------'));
    console.log(cyan('  Dynatrace Angular Components stage release script'));
    console.log(cyan('-----------------------------------------------------'));
    console.log();

    const newVersion = await promptForNewVersion(this.currentVersion);
    const newVersionName = newVersion.format();
    const needsVersionBump = !newVersion.equals(this.currentVersion);
    const stagingBranch = `release-stage/${newVersionName}`;

    console.log();

    this.verifyNoUncommittedChanges();

    // Branch that will be used to stage the release for the
    // new selected version.
    const publishBranch = this._switchToPublishBranch(newVersion);

    this.verifyLocalCommitsMatchUpstream(publishBranch);
    await this._verifyPassingGithubStatus(publishBranch);

    if (!this.git.checkoutNewBranch(stagingBranch)) {
      console.error(
        red(
          `Could not create release staging branch: ${stagingBranch}. ` +
            `Aborting...`,
        ),
      );
      process.exit(1);
    }

    if (needsVersionBump) {
      this.updatePackageJsonVersion(newVersionName);

      console.log(
        green(
          `  ✓   Updated the version to "${bold(
            newVersionName,
          )}" inside of the ${italic('package.json')}`,
        ),
      );
      console.log();
    }

    await promptAndGenerateChangelog(
      join(this.projectDir, CHANGELOG_FILE_NAME),
      '',
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
      !(await this._promptConfirm(
        'Do you want to proceed and commit the changes?',
      ))
    ) {
      console.log();
      console.log(yellow('Aborting release staging...'));
      process.exit(1);
    }

    this.git.stageAllChanges();

    if (needsVersionBump) {
      this.git.createNewCommit(getReleaseCommit(newVersionName));
    } else {
      this.git.createNewCommit(`chore: Update changelog for ${newVersionName}`);
    }

    console.info();
    console.info(
      green(`  ✓   Created the staging commit for: "${newVersionName}".`),
    );
    console.info();

    // Pushing
    if (!this.git.pushBranchOrTagToRemote(stagingBranch)) {
      console.error(
        red(
          `Could not push release staging branch "${stagingBranch}" to remote`,
        ),
      );
      process.exit(1);
    }
    console.info(
      green(
        `  ✓   Pushed release staging branch "${stagingBranch}" to remote.`,
      ),
    );

    const prTitle = needsVersionBump
      ? 'Bump version to ${version} w/ changelog'
      : 'Update changelog for ${newVersionName}';
    const { state } = (await this.githubApi.pulls.create({
      title: prTitle,
      head: stagingBranch,
      base: 'master',
      owner: this.repositoryOwner,
      repo: this.repositoryName,
    })).data;

    if (state === 'failure') {
      console.error(
        red(
          `Could not push create a pull-request for release staging branch "${stagingBranch}"` +
            `Please create the pull-request named "${prTitle}" by hand.`,
        ),
      );
      process.exit(1);
    }
    console.info(
      green(
        `  ✓   Created the pull-request "${prTitle}" for the release staging branch "${stagingBranch}".`,
      ),
    );
  }

  /**
   * Checks if the user is on an allowed publish branch
   * for the specified version.
   */
  private _switchToPublishBranch(newVersion: Version): string {
    const allowedBranch = getAllowedPublishBranch(newVersion);
    const currentBranchName = this.git.getCurrentBranch();

    // If current branch already matches one of the allowed publish branches,
    // just continue by exiting this function and returning the currently
    // used publish branch.
    if (allowedBranch === currentBranchName) {
      console.log(
        green(`  ✓   Using the "${italic(currentBranchName)}" branch.`),
      );
      return currentBranchName;
    } else {
      if (!this.git.checkoutBranch(allowedBranch)) {
        console.error(
          red(
            `  ✘   Could not switch to the "${italic(allowedBranch)}" ` +
              `branch.`,
          ),
        );
        console.error(
          red(
            `      Please ensure that the branch exists or manually switch ` +
              `to the branch.`,
          ),
        );
        process.exit(1);
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
  private updatePackageJsonVersion(newVersionName: string): void {
    const newPackageJson = { ...this.packageJson, version: newVersionName };
    writeFileSync(
      this.packageJsonPath,
      `${JSON.stringify(newPackageJson, null, 2)}\n`,
    );
  }

  /**
   * Verifies that the local branch is up to date with the given publish branch.
   */
  private verifyLocalCommitsMatchUpstream(publishBranch: string): void {
    const upstreamCommitSha = this.git.getRemoteCommitSha(publishBranch);
    const localCommitSha = this.git.getLocalCommitSha('HEAD');
    console.log(localCommitSha, upstreamCommitSha);
    // Check if the current branch is in sync with the remote branch.
    if (upstreamCommitSha !== localCommitSha) {
      console.error(
        red(
          `  ✘ Cannot stage release. The current branch is not in sync with ` +
            `the remote branch. Please make sure your local branch "${italic(
              publishBranch,
            )}" is up ` +
            `to date.`,
        ),
      );
      process.exit(1);
    }
  }

  /** Verifies that there are no uncommitted changes in the project. */
  private verifyNoUncommittedChanges(): void {
    if (this.git.hasUncommittedChanges()) {
      console.error(
        red(
          `  ✘ Cannot stage release. ` +
            `There are changes which are not committed and should be stashed.`,
        ),
      );
      process.exit(1);
    }
  }

  /** Verifies that the latest commit of the current branch is passing all Github statuses. */
  private async _verifyPassingGithubStatus(
    expectedPublishBranch: string,
  ): Promise<void> {
    const commitRef = this.git.getLocalCommitSha('HEAD');
    const githubCommitsUrl = getGithubBranchCommitsUrl(
      this.repositoryOwner,
      this.repositoryName,
      expectedPublishBranch,
    );
    const { state } = (await this.githubApi.repos.getCombinedStatusForRef({
      owner: this.repositoryOwner,
      repo: this.repositoryName,
      ref: commitRef,
    })).data;

    if (state === 'failure') {
      console.error(
        red(
          `  ✘   Cannot stage release. Commit "${commitRef}" does not pass all github ` +
            `status checks. Please make sure this commit passes all checks before re-running.`,
        ),
      );
      console.error(red(`      Please have a look at: ${githubCommitsUrl}`));

      if (
        await this._promptConfirm(
          'Do you want to ignore the Github status and proceed?',
        )
      ) {
        console.info(
          green(
            `  ⚠   Upstream commit is failing CI checks, but status has been ` +
              `forcibly ignored.`,
          ),
        );
        return;
      }
      process.exit(1);
    } else if (state === 'pending') {
      console.error(
        red(
          `  ✘   Commit "${commitRef}" still has pending github statuses that ` +
            `need to succeed before staging a release.`,
        ),
      );
      console.error(red(`      Please have a look at: ${githubCommitsUrl}`));

      if (
        await this._promptConfirm(
          'Do you want to ignore the Github status and proceed?',
        )
      ) {
        console.info(
          green(
            `  ⚠   Upstream commit is pending CI, but status has been ` +
              `forcibly ignored.`,
          ),
        );
        return;
      }
      process.exit(0);
    }

    console.info(
      green(`  ✓   Upstream commit is passing all github status checks.`),
    );
  }

  /** Prompts the user with a confirmation question and a specified message. */
  private async _promptConfirm(message: string): Promise<boolean> {
    return (await prompt<{ result: boolean }>({
      type: 'confirm',
      name: 'result',
      message: message,
    })).result;
  }
}

/** Entry-point for the release staging script. */
if (require.main === module) {
  new StageReleaseTask(
    join(__dirname, '../../../'),
    'dynatrace-oss',
    'barista',
  ).run();
}
