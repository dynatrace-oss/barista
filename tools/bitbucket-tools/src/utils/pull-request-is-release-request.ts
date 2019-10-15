import { BitbucketApiPr } from 'src/interfaces/bitbucket/bitbucket-api-pull-request';

/** Determines if a pull request is a release-pull request */
export function isReleasePullRequest(pullRequest: BitbucketApiPr): boolean {
  return pullRequest.fromRef.displayId.startsWith('release-stage/');
}
