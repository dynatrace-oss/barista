import { BitbucketApiCommit } from './bitbucket-api-commit';
import { BitbucketPagedApi } from './bitbucket-paged-api';

export interface BitbucketApiPrCommits extends BitbucketPagedApi {
  values: BitbucketApiCommit[];
}
