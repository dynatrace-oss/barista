import { BitbucketApiUser } from './bitbucket-api-user';

export interface BitbucketApiCommit {
  id: string;
  displayId: string;
  author: BitbucketApiUser;
  authorTimestamp: number;
  commiter: BitbucketApiUser;
  commiterTimestamp: number;
  message: string;
  parents: {
    id: string;
    displayId: string;
  }[];
}
