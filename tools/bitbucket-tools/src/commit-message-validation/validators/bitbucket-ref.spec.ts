import { BitbucketApiRef } from '../../interfaces/bitbucket/bitbucket-api-ref';
import { BitbucketApiRepository } from '../../interfaces/bitbucket/bitbucket-api-repository';

export const repository: BitbucketApiRepository = {
  slug: 'angular-components',
  id: 1393,
  name: 'angular-components',
  scmId: 'git',
  state: 'AVAILABLE',
  statusMessage: 'Available',
  forkable: true,
  project: {
    key: 'RX',
    id: 63,
    name: 'Dynatrace SaaS/Managed',
    description:
      'All projects related to Dynatrace SaaS/Managed product development.',
    public: false,
    type: 'NORMAL',
    links: {
      self: [],
    },
  },
  public: true,
  links: {
    clone: [],
    self: [],
  },
};

export const patchTargetRef: BitbucketApiRef = {
  id: 'refs/heads/4.8.x',
  displayId: '4.8.x',
  latestCommit: '49c41f08760b061bbc5ab75d65ea09613a109599',
  repository,
};

export const minorTargetRef: BitbucketApiRef = {
  id: 'refs/heads/4.x',
  displayId: '4.x',
  latestCommit: '49c41f08760b061bbc5ab75d65ea09613a109599',
  repository,
};

export const masterTargetRef: BitbucketApiRef = {
  id: 'refs/heads/master',
  displayId: 'master',
  latestCommit: '49c41f08760b061bbc5ab75d65ea09613a109599',
  repository,
};

describe('Bitbucket refspec fixtures', () => {
  test('to not have it empty', () => {
    expect(true).toBe(true);
  });
});
