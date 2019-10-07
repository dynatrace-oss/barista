import { BitbucketApiLink } from './bitbucket-api-link';

export interface BitbucketApiProject {
  key: string;
  id: number;
  name: string;
  description: string;
  public: boolean;
  type: 'NORMAL' | any;
  links: {
    self: BitbucketApiLink[];
  };
}
