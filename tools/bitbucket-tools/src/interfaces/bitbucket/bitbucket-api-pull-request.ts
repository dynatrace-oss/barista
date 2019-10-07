import { BitbucketApiLink } from './bitbucket-api-link';
import { BitbucketApiParticipant } from './bitbucket-api-participant';
import { BitbucketApiRef } from './bitbucket-api-ref';

export interface BitbucketApiPr {
  id: number;
  version: number;
  title: string;
  description: string;
  state: 'OPEN' | 'DECLINED' | 'MERGED';
  open: boolean;
  closed: boolean;
  createdDate: number;
  updatedDate: number;
  fromRef: BitbucketApiRef;
  toRef: BitbucketApiRef;
  locked: boolean;
  author: BitbucketApiParticipant;
  reviewers: BitbucketApiParticipant[];
  participants: BitbucketApiParticipant[];
  properties: {
    mergeResult: {
      output: 'CLEAN' | any;
      current: boolean;
    };
    resolvedTaskCount: number;
    commentCount: number;
    openTaskCount: number;
  };
  links: {
    self: BitbucketApiLink[];
  };
}
