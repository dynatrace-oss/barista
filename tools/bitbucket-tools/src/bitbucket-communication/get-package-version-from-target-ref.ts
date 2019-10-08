import Axios from 'axios';

import { BITBUCKET_HOST, BITBUCKET_PASSWORD, BITBUCKET_USER } from '../config';
import { BitbucketApiPr } from '../interfaces/bitbucket/bitbucket-api-pull-request';
import { BitbucketApiRef } from '../interfaces/bitbucket/bitbucket-api-ref';

/** Get the version of  */
export async function getPackageVersionFromTargetRef(
  currentPR: BitbucketApiPr,
  onRef: BitbucketApiRef,
): Promise<string> {
  const packageJson = await Axios.get<{ version: string }>(
    `${BITBUCKET_HOST}/rest/api/1.0/projects/${currentPR.toRef.repository.project.key}/repos/${currentPR.toRef.repository.slug}/raw/package.json`,
    {
      params: { at: onRef.displayId },
      auth: { username: BITBUCKET_USER, password: BITBUCKET_PASSWORD },
    },
  );
  return packageJson.data.version;
}
