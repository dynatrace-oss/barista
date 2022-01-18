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

import { italic } from 'chalk';
import { PackageJson } from '@dynatrace/shared/node';

export const NO_TOKEN_PROVIDED_ERROR = (tokenName: string) =>
  `Please ensure that you provide the ${tokenName} for the script`;

export const GET_INVALID_PACKAGE_JSON_VERSION_ERROR = (
  packageJson: PackageJson,
) =>
  `Cannot parse current version in ${italic('package.json')}. Please ` +
  `make sure "${packageJson.version}" is a valid Semver version.`;

export const GET_GITHUB_STATUS_FAILED_ERROR = (commitSha: string) =>
  `The commit "${commitSha}" did not pass all github checks! Aborting...`;

export const GET_GITHUB_STATUS_PENDING_ERROR = (
  commitSha: string,
  githubCommitsUrl: string,
) =>
  `  ✘   Commit "${commitSha}" still has pending github statuses that ` +
  `need to succeed before staging a release. Please have a look at: ${githubCommitsUrl}`;

export const GET_LOCAL_DOES_NOT_MATCH_UPSTREAM = (publishBranch: string) =>
  `  ✘ The current branch is not in sync with ` +
  `the remote branch. Please make sure your local branch "${italic(
    publishBranch,
  )}" is up to date.`;

export const NO_VALID_RELEASE_BRANCH_ERROR =
  'We are not on a valid release branch -- aborting release';

export const UNCOMMITED_CHANGES_ERROR =
  'There are changes which are not committed and should be stashed.';

export const CHANGELOG_PARSE_ERROR =
  '  ✘   Could not find release notes in the changelog.';

export const GET_LOCAL_TAG_EXISTS_BUT_NO_BUMP_ERROR = (tagName: string) =>
  `  ✘   Tag "${tagName}" already exists locally, but does not refer ` +
  `to the version bump commit. Please delete the tag if you want to proceed.`;

export const GET_TAG_ALREADY_EXISTS = (tagName: string) =>
  `  ✘   Could not create the "${tagName}" tag.` +
  '    Please make sure there is no existing tag with the same name.';

export const GET_TAG_ALREADY_EXISTS_ON_REMOTE = (tagName: string) =>
  `  ✘   Tag "${tagName}" already exists on the remote, but does not ` +
  `refer to the version bump commit.`;

export const GET_TAG_PUSH_ERROR = (tagName: string) =>
  `  ✘   Could not push the "${tagName}" tag upstream.`;

export const BUNDLE_VERSION_ERROR =
  '  ✘ We detected a mismatch between the version in the package.json from the artifact' +
  'and the version in your current branch. Make sure that the downloaed artifact is the correct one.';

export const GET_FAILED_CREATE_STAGING_BRANCH_ERROR = (stagingBranch: string) =>
  `Could not create release staging branch: ${stagingBranch}. Aborting...`;

export const ABORT_RELEASE = 'Aborting release staging...';

export const GET_BRANCH_SWITCH_ERROR = (allowedBranch: string) =>
  `  ✘   Could not switch to the "${italic(allowedBranch)}" branch.\n` +
  `      Please ensure that the branch exists or manually switch ` +
  `to the branch.`;

export const GET_PUSH_RELEASE_BRANCH_ERROR = (stagingBranch: string) =>
  `Could not push release staging branch "${stagingBranch}" to remote`;

export const GET_PR_CREATION_ERROR = (stagingBranch: string, prTitle: string) =>
  `Could not push create a pull-request for release staging branch "${stagingBranch}"` +
  `Please create the pull-request named "${prTitle}" by hand.`;

export const NPM_PUBLISH_FAILED_ERROR = (errorMessage: string) =>
  `Could not run NPM publish: \n${errorMessage}`;

export const YARN_PUBLISH_FAILED_ERROR = (errorMessage: string) =>
  `Could not run YARN publish for the internal version: \n${errorMessage}`;
