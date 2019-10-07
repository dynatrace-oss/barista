import Axios from 'axios';

import {
  BITBUCKET_HOST,
  BITBUCKET_PASSWORD,
  BITBUCKET_PROJECT,
  BITBUCKET_REPO,
  BITBUCKET_USER,
} from '../config';
import { BitbucketApiAllPrs } from '../interfaces/bitbucket/bitbucket-api-all-pull-requests';
import { BitbucketApiPr } from '../interfaces/bitbucket/bitbucket-api-pull-request';

/** Get the pull request definition by refId (branch name) */
export async function getPullRequestByRefId(
  refId: string,
): Promise<BitbucketApiPr | undefined> {
  const allPrs = await Axios.get<BitbucketApiAllPrs>(
    `${BITBUCKET_HOST}/rest/api/1.0/projects/${BITBUCKET_PROJECT}/repos/${BITBUCKET_REPO}/pull-requests`,
    {
      params: { limit: 100, state: 'OPEN' },
      auth: { username: BITBUCKET_USER, password: BITBUCKET_PASSWORD },
    },
  );
  const currentPR = allPrs.data.values.find(pr => pr.fromRef.id === refId);
  return currentPR;
}

/** Get the pull request definition based on the pull request id. */
export async function getPullRequestById(
  prId: string,
): Promise<BitbucketApiPr> {
  const pr = await Axios.get<BitbucketApiPr>(
    `${BITBUCKET_HOST}/rest/api/1.0/projects/${BITBUCKET_PROJECT}/repos/${BITBUCKET_REPO}/pull-requests/${prId}`,
    { auth: { username: BITBUCKET_USER, password: BITBUCKET_PASSWORD } },
  );
  return pr.data;
}
