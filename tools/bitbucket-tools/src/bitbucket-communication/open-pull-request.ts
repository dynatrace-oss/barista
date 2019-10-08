import Axios from 'axios';

import {
  BITBUCKET_HOST,
  BITBUCKET_PASSWORD,
  BITBUCKET_PROJECT,
  BITBUCKET_REPO,
  BITBUCKET_USER,
} from '../config';
import { BitbucketApiPr } from '../interfaces/bitbucket/bitbucket-api-pull-request';

/** Opens a pull request */
export async function openPullRequest(
  title: string,
  description: string,
  fromRef: string,
  toRef: string,
): Promise<BitbucketApiPr | undefined> {
  const data = {
    title,
    description,
    state: 'OPEN',
    closed: false,
    fromRef: {
      id: fromRef,
      // repository: {
      //   slug: 'angular-components',
      //   name: null,
      //   project: {
      //     key: '~thomas.heller',
      //   },
      // },
    },
    toRef: {
      id: toRef,
      // repository: {
      //   slug: 'angular-components',
      //   name: null,
      //   project: {
      //     key: '~thomas.heller',
      //   },
      // },
    },
    locked: false,
    reviewers: [],
  };

  const createdPullRequest = await Axios.post<BitbucketApiPr>(
    `${BITBUCKET_HOST}/rest/api/1.0/projects/${BITBUCKET_PROJECT}/repos/${BITBUCKET_REPO}/pull-requests`,
    data,
    {
      auth: { username: BITBUCKET_USER, password: BITBUCKET_PASSWORD },
    },
  );

  return createdPullRequest.data;
}
