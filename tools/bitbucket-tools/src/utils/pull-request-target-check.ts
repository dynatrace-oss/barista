import { BitbucketApiRef } from '../interfaces/bitbucket/bitbucket-api-ref';

/** Validates if the target branch is a patch branch. */
export function isPatchTarget(target: BitbucketApiRef): boolean {
  return /refs\/heads\/(\d+).(\d+).x/i.test(target.id);
}

/** Validates if the target branch is a patch branch. */
export function isMinorTarget(target: BitbucketApiRef): boolean {
  return /refs\/heads\/(\d+).x/i.test(target.id);
}

/** Validates if the target branch is a patch branch. */
export function isMasterTarget(target: BitbucketApiRef): boolean {
  return /refs\/heads\/master/i.test(target.id);
}
