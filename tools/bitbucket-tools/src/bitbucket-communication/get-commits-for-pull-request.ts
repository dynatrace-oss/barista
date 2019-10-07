import Axios from 'axios';

import {
  BITBUCKET_HOST,
  BITBUCKET_PASSWORD,
  BITBUCKET_PROJECT,
  BITBUCKET_REPO,
  BITBUCKET_USER,
} from '../config';
import { BitbucketApiPr } from '../interfaces/bitbucket/bitbucket-api-pull-request';
import { BitbucketApiPrCommits } from '../interfaces/bitbucket/bitbucket-api-pull-request-commits';

/**
 * Fetches the commits for the given pull request from the bitbucket api.
 * @param currentPR Pull request for which the commits should be fetched.
 */
export async function getCommitsForPullRequest(
  currentPR: BitbucketApiPr,
): Promise<string[]> {
  const allCommits = await Axios.get<BitbucketApiPrCommits>(
    `${BITBUCKET_HOST}/rest/api/1.0/projects/${BITBUCKET_PROJECT}/repos/${BITBUCKET_REPO}/pull-requests/${currentPR.id}/commits`,
    {
      params: { limit: 100 },
      auth: { username: BITBUCKET_USER, password: BITBUCKET_PASSWORD },
    },
  );
  return allCommits.data.values.map(commit => commit.message);
}
