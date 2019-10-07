import { BitbucketApiLink } from './bitbucket-api-link';
import { BitbucketApiProject } from './bitbucket-api-project';

export interface BitbucketApiRepository {
  slug: string;
  id: number;
  name: string;
  scmId: 'git' | any;
  state: 'AVAILABLE' | any;
  statusMessage: string;
  forkable: boolean;
  project: BitbucketApiProject;
  public: boolean;
  links: {
    clone: BitbucketApiLink[];
    self: BitbucketApiLink[];
  };
}
