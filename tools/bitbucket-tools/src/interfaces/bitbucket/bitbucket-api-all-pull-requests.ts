import { BitbucketApiPr } from './bitbucket-api-pull-request';
import { BitbucketPagedApi } from './bitbucket-paged-api';

export interface BitbucketApiAllPrs extends BitbucketPagedApi {
  values: BitbucketApiPr[];
}
