import Axios from 'axios';

import {
  BITBUCKET_HOST,
  BITBUCKET_PASSWORD,
  BITBUCKET_PROJECT,
  BITBUCKET_REPO,
  BITBUCKET_USER,
} from '../config';
import { BitbucketApiPr } from '../interfaces/bitbucket/bitbucket-api-pull-request';

/** Sends a comment to the passed pull request. */
export async function sendCommentToPullRequest(
  comment: string,
  pullRequest: BitbucketApiPr,
): Promise<void> {
  await Axios.post<void>(
    `${BITBUCKET_HOST}/rest/api/1.0/projects/${BITBUCKET_PROJECT}/repos/${BITBUCKET_REPO}/pull-requests/${pullRequest.id}/comments`,
    {
      text: comment,
    },
    {
      auth: {
        username: BITBUCKET_USER,
        password: BITBUCKET_PASSWORD,
      },
    },
  );
}
