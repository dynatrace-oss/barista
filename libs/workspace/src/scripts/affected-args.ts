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

import { appendFileSync } from 'fs';
import { Octokit } from '@octokit/rest';
import { CircleCiApi } from '@dynatrace/shared/node';

export const NO_CIRCLE_TOKEN_PROVIDED_ERROR =
  'Something went wrong with the circle API token please provide it!';

const FALLBACK = 'origin/master';

/** Checks if we are on the master or a release branch */
export function isMasterOrReleaseBranch(branchName: string): boolean {
  // https://regex101.com/r/viVbWM/1
  return /^([0-9]{1,}\.x|[0-9]{1,}\.[0-9]{1,}\.x|master)$/.test(branchName);
}

/** Returns the base SHA of the commit or origin/master as fallback */
export async function affectedArgs(): Promise<string> {
  const {
    GITHUB_TOKEN,
    CIRCLE_API_TOKEN,
    CIRCLE_BRANCH,
    CIRCLE_PROJECT_USERNAME,
    CIRCLE_PROJECT_REPONAME,
    CIRCLE_PULL_REQUEST,
  } = process.env;

  // Octokit API instance that can be used to make Github API calls.
  const githubApi = new Octokit({
    // in a fork it would be undefined
    auth: GITHUB_TOKEN,
  });

  // The PR number is always the last number in the url
  // https://regex101.com/r/ELA9M3/1/
  const prNumber = CIRCLE_PULL_REQUEST?.match(/\d+$/) ?? null;
  // If it is a pull request get the sha of the compare branch from the
  // github api.
  if (prNumber?.length) {
    const pullRequest = await githubApi.pulls.get({
      pull_number: parseInt(prNumber[0], 10),
      owner: CIRCLE_PROJECT_USERNAME!,
      repo: CIRCLE_PROJECT_REPONAME!,
    });
    return pullRequest.data?.base?.sha || FALLBACK;
  }

  // If this case is happening then we should throw an error, because then somebody
  // deleted the token in the context and we have to fail the builds.
  if (!CIRCLE_API_TOKEN?.length) {
    throw new Error(NO_CIRCLE_TOKEN_PROVIDED_ERROR);
  }

  // If the branch is the master or a release branch,
  // get the last successful run of the workflow and
  // its commit sha as base.
  if (isMasterOrReleaseBranch(CIRCLE_BRANCH!)) {
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

// if filename is set the file is executed via an import or require.
// This should only run on direct execution with nodejs.
if (!require.main?.filename) {
  affectedArgs()
    .then((base) => {
      const { BASH_ENV } = process.env;
      // Store the affected args in the $BASH_ENV variable that
      // is set through circle ci.
      if (BASH_ENV) {
        appendFileSync(BASH_ENV, `\nexport AFFECTED_ARGS="--base=${base}"\n`);
        console.log(`Successfully added the --base=${base}`);
      }
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
