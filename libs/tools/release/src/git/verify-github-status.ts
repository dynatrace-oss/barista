/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { Octokit } from '@octokit/rest';
import { GitClient } from './git-client';
import {
  GITHUB_REPO_OWNER,
  GITHUB_REPO_NAME,
  getGithubBranchCommitsUrl,
} from './github-urls';
import {
  GET_LOCAL_DOES_NOT_MATCH_UPSTREAM,
  GET_GITHUB_STATUS_PENDING_ERROR,
  GET_GITHUB_STATUS_FAILED_ERROR,
  UNCOMMITED_CHANGES_ERROR,
} from '../utils';

/**
 * Verifies that the github status for the latest local commit passed
 *
 * @throws Will throw if the state is not successful
 */
export async function verifyPassingGithubStatus(
  git: GitClient,
  githubApi: Octokit,
  branchName: string,
): Promise<void> {
  const githubCommitsUrl = getGithubBranchCommitsUrl(
    GITHUB_REPO_OWNER,
    GITHUB_REPO_NAME,
    branchName,
  );
  const commitSha = git.getLocalCommitSha('HEAD');
  const { state } = (
    await githubApi.repos.getCombinedStatusForRef({
      owner: GITHUB_REPO_OWNER,
      repo: GITHUB_REPO_NAME,
      ref: commitSha,
    })
  ).data;
  if (state === 'pending') {
    throw new Error(
      GET_GITHUB_STATUS_PENDING_ERROR(commitSha, githubCommitsUrl),
    );
  } else if (state === 'error') {
    throw new Error(GET_GITHUB_STATUS_FAILED_ERROR(commitSha));
  }
}

/**
 * Verifies that all commits have been pushed to the upstream
 *
 * @throws Will throw an error if the local commit does not match the latest
 * upstream commit
 */
export function verifyLocalCommitsMatchUpstream(
  git: GitClient,
  publishBranch: string,
): void {
  const upstreamCommitSha = git.getRemoteCommitSha(publishBranch);
  const localCommitSha = git.getLocalCommitSha('HEAD');
  // Check if the current branch is in sync with the remote branch.
  if (upstreamCommitSha !== localCommitSha) {
    throw new Error(GET_LOCAL_DOES_NOT_MATCH_UPSTREAM(publishBranch));
  }
}

/**
 * Verifies that there are no uncommited changes
 *
 * @throws Will throw an error if there are uncommited changes
 */
export function verifyNoUncommittedChanges(git: GitClient): void {
  if (git.hasUncommittedChanges()) {
    throw new Error(UNCOMMITED_CHANGES_ERROR);
  }
}
