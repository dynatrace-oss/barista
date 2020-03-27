/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { appendFileSync } from 'fs';
import { Octokit } from '@octokit/rest';

import { CircleCiApi } from '@dynatrace/shared/node';

const {
  GITHUB_TOKEN,
  CIRCLE_API_TOKEN,
  CIRCLE_BRANCH,
  BASH_ENV,
  CIRCLE_PROJECT_USERNAME,
  CIRCLE_PROJECT_REPONAME,
  CIRCLE_PR_NUMBER,
} = process.env;

const FALLBACK = 'origin/master';

/** Checks if we are on the master or a release branch */
export function isMasterOrReleaseBranch(): boolean {
  // https://regex101.com/r/viVbWM/1
  return /^([0-9]{1,}\.x|[0-9]{1,}\.[0-9]{1,}\.x|master)$/.test(CIRCLE_BRANCH!);
}

/** Returns the base SHA of the commit or origin/master as fallback */
async function affectedArgs(): Promise<string> {
  // Octokit API instance that can be used to make Github API calls.
  const githubApi = new Octokit({
    // in a fork it would be undefined
    auth: GITHUB_TOKEN,
  });

  // If it is a pull request get the sha of the compare branch from the
  // github api.
  if (CIRCLE_PR_NUMBER) {
    const pullRequest = await githubApi.pulls.get({
      pull_number: parseInt(CIRCLE_PR_NUMBER, 10),
      owner: CIRCLE_PROJECT_USERNAME!,
      repo: CIRCLE_PROJECT_REPONAME!,
    });

    return pullRequest.data?.base?.sha || FALLBACK;
  }

  // If the branch is the master or a release branch,
  // get the last successful run of the workflow and
  // its commit sha as base.
  if (isMasterOrReleaseBranch() && CIRCLE_API_TOKEN) {
    try {
      const circleApi = new CircleCiApi(CIRCLE_API_TOKEN);
      return await circleApi
        .getCommitShaOfLastSuccessfulRun(CIRCLE_BRANCH!)
        .toPromise();
    } catch {
      return FALLBACK;
    }
  }

  // for all normal branches or as fallback use the
  // origin/master as fallback
  return FALLBACK;
}

affectedArgs()
  .then(base => {
    // Store the affected args in the $BASH_ENV variable that
    // is set through circle ci.
    if (BASH_ENV) {
      appendFileSync(BASH_ENV, `\nexport AFFECTED_ARGS="--base=${base}"\n`);
      console.log(`Successfully added the --base=${base}`);
    }
  })
  .catch();
