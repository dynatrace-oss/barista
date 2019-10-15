import Axios from 'axios';

import {
  BITBUCKET_HOST,
  BITBUCKET_PASSWORD,
  BITBUCKET_PROJECT,
  BITBUCKET_REPO,
  BITBUCKET_USER,
} from '../config';
import { BitbucketApiCommit } from '../interfaces/bitbucket/bitbucket-api-commit';
import { BitbucketApiPrCommits } from '../interfaces/bitbucket/bitbucket-api-pull-request-commits';

/**
 * Gets an array of commits that were in the pullrequest,
 * and maps them to commits in master. They may get a different
 * commit hash based on the merge strategy set in bitbucket.
 */
export async function matchCommitsInMaster(
  commitsInPullRequest: BitbucketApiCommit[],
): Promise<string[]> {
  const latestCommitsInMaster = await Axios.get<BitbucketApiPrCommits>(
    `${BITBUCKET_HOST}/rest/api/1.0/projects/${BITBUCKET_PROJECT}/repos/${BITBUCKET_REPO}/commits`,
    {
      params: { limit: 100 },
      auth: { username: BITBUCKET_USER, password: BITBUCKET_PASSWORD },
    },
  );

  const mappedCommits: string[] = [];
  for (const commit of commitsInPullRequest) {
    const matchedCommit = latestCommitsInMaster.data.values.find(
      masterCommit =>
        masterCommit.author.id === commit.author.id &&
        masterCommit.message === commit.message &&
        masterCommit.authorTimestamp === commit.authorTimestamp,
    );
    if (!matchedCommit) {
      throw new Error('Not able to map pull request commit to master commit');
    }
    mappedCommits.push(matchedCommit.id);
  }
  return mappedCommits;
}
