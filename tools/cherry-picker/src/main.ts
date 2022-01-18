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

import { getInput } from '@actions/core';
import { context, GitHub } from '@actions/github';
import { getPullRequestDetails } from './utils/get-pull-request-details';
import { isMasterTarget } from './utils/is-master-target';
import { findMergedCommitsOnMaster } from './utils/find-merged-commits-on-master';
import { pullRequestHasLabel } from './utils/pull-request-has-label';
import { getCurrentMinorAndPatchBranches } from './utils/get-current-minor-and-patch-branches';
import { cherryPickCommits } from 'github-cherry-pick';
import { pullRequestAddComment } from './utils/pull-request-add-comment';

function getPrNumber(): number | undefined {
  const pullRequest = context.payload.pull_request;
  if (!pullRequest) {
    return undefined;
  }

  return pullRequest.number;
}

async function run(): Promise<void> {
  const token = getInput('repo-token', { required: true });

  // Get the pull request that should be processed.
  const prNumber = getPrNumber();
  if (!prNumber) {
    console.log('Could not get pull request number from context, exiting');
    return;
  }

  const client = new GitHub(token);

  // Get the pull request target
  const pullRequestDetails = await getPullRequestDetails(client, prNumber);

  // If the target is not master, skip out of the cherrypicking.
  if (!isMasterTarget(pullRequestDetails.base)) {
    console.log('Target of the PR is not master, no cherry picking involved');
    return;
  }

  // Check if we need to cherry pick at all
  if (
    !pullRequestHasLabel(pullRequestDetails, 'target: minor') &&
    !pullRequestHasLabel(pullRequestDetails, 'target: patch')
  ) {
    console.log(
      'Pull request does not have target labels on it, no cherry picking involved',
    );
    return;
  }

  // Find the commits on the master
  const commitsOnMaster = await findMergedCommitsOnMaster(client, prNumber);

  // We need to reverse the found commits, to keep them in the right order
  // when cherry picking.
  const reversedCommitsOnMaster = commitsOnMaster.reverse();

  // If we were not able to map the commits from the pull request to master
  // commits
  if (!commitsOnMaster.length) {
    await pullRequestAddComment(
      client,
      prNumber,
      '@dynatrace-oss/barista The auto cherry picker failed to determine the commits on master, that should be cherry picked.',
    );
    throw new Error('Not able to map pull request commit to master commit');
  }

  // Get the current minor and patch branches based on the version of the
  // master package json.
  const { currentMinorBranch, currentPatchBranch } =
    await getCurrentMinorAndPatchBranches();

  const cherryPickMessages: string[] = [];
  if (pullRequestHasLabel(pullRequestDetails, 'target: minor')) {
    try {
      // Cherry pick to the minor branch
      const cherryPickToMinor = await cherryPickCommits({
        commits: reversedCommitsOnMaster,
        head: currentMinorBranch,
        octokit: client,
        owner: context.repo.owner,
        repo: context.repo.repo,
      });
      cherryPickMessages.push(
        `Cherry picked to minor branch ${currentMinorBranch}. New head is now ${cherryPickToMinor}`,
      );
    } catch (err) {
      await pullRequestAddComment(
        client,
        prNumber,
        '@dynatrace-oss/barista, the auto cherry picker failed. Please have a look at the failure and cherry pick by hand.',
      );
      console.log(
        `Failed to cherry pick ${reversedCommitsOnMaster.join(
          ', ',
        )} to ${currentMinorBranch}.`,
      );
      throw err;
    }
  }

  if (pullRequestHasLabel(pullRequestDetails, 'target: patch')) {
    try {
      // Cherry pick to the minor branch
      const cherryPickToPatch = await cherryPickCommits({
        commits: reversedCommitsOnMaster,
        head: currentPatchBranch,
        octokit: client,
        owner: context.repo.owner,
        repo: context.repo.repo,
      });
      cherryPickMessages.push(
        `Cherry picked to patch branch ${currentPatchBranch}. New head is now ${cherryPickToPatch}`,
      );
    } catch (err) {
      await pullRequestAddComment(
        client,
        prNumber,
        '@dynatrace-oss/barista, the auto cherry picker failed. Please have a look at the failure and cherry pick by hand.',
      );
      console.log(
        `Failed to cherry pick ${reversedCommitsOnMaster.join(
          ', ',
        )} to ${currentPatchBranch}.`,
      );
      throw err;
    }
  }
  await pullRequestAddComment(
    client,
    prNumber,
    `The auto cherry picker succeeded.${cherryPickMessages.join('\n')}`,
  );
}

run().catch((error) => {
  console.log(error);
  process.exit(1);
});
