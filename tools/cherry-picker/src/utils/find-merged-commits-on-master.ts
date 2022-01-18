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

import { context, GitHub } from '@actions/github';
import { ReposListCommitsResponseItem } from '@octokit/rest';
/**
 * Finds the commits from the pull request in the merged master branch
 * by comparing author, autor timestamp and the commit message.
 */
export async function findMergedCommitsOnMaster(
  client: GitHub,
  prNumber: number,
): Promise<string[]> {
  // Find the commits on the pull request
  const listCommitMessagesResponse = await client.pulls.listCommits({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: prNumber,
  });

  // Get the last 100 commits on master as a reference
  const masterCommitsResponse = await client.repos.listCommits({
    owner: context.repo.owner,
    repo: context.repo.repo,
    sha: 'master',
  });

  const mergedCommitsOnMaster: string[] = [];
  // Find the commits from the pull request on the master branch
  // They may have a different commit hash, because of the set merge
  // strategy on github is rebase and merge.
  for (const commit of listCommitMessagesResponse.data) {
    const matchedCommit = masterCommitsResponse.data.find(
      (masterCommit: ReposListCommitsResponseItem) => {
        return (
          masterCommit.author.id === commit.author.id &&
          masterCommit.commit.message === commit.commit.message &&
          masterCommit.commit.author.date === commit.commit.author.date
        );
      },
    );
    mergedCommitsOnMaster.push(matchedCommit!.sha);
  }

  return mergedCommitsOnMaster;
}
