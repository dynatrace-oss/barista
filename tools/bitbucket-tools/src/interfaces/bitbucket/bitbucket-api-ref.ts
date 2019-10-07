import { BitbucketApiRepository } from './bitbucket-api-repository';

export interface BitbucketApiRef {
  id: string;
  displayId: string;
  latestCommit: string;
  repository: BitbucketApiRepository;
}
