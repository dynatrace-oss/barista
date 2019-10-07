import { BitbucketApiLink } from './bitbucket-api-link';
import { BitbucketApiUser } from './bitbucket-api-user';

export interface BitbucketApiParticipant {
  user: BitbucketApiUser & {
    links: {
      self: BitbucketApiLink[];
    };
  };

  role: 'AUTHOR' | 'PARTICIPANT' | any;
  approved: boolean;
  status: 'APPROVED' | 'UNAPPROVED';
}
