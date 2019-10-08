import { BITBUCKET_PASSWORD, BITBUCKET_USER } from '../config';

/** Adds username:password to the remote url */
export function addAuthorizationToRemoteUrl(remoteUrl: string): string {
  const url = new URL(remoteUrl);
  url.username = BITBUCKET_USER;
  url.password = BITBUCKET_PASSWORD;
  return url.href;
}
