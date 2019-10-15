import { Component, Input } from '@angular/core';

import { formatContributorName } from '../../utils/formatContributorNames';

const BITBUCKET_USERNAME_LENGTH = 20;

@Component({
  selector: 'ba-contributors',
  templateUrl: 'contributors.html',
  styleUrls: ['contributors.scss'],
  host: {
    class: 'ba-contributors-column',
  },
})
export class BaContributors {
  @Input() type: 'ux' | 'dev';
  @Input() names: string[];

  /**
   * @internal
   * returns the name capitalized and with a space between first and last name
   */
  _displayName(name: string): string {
    return formatContributorName(name);
  }

  /** @internal */
  _imageUrl(name: string): string {
    const bitbucketUser = name.slice(0, BITBUCKET_USERNAME_LENGTH);
    return `***REMOVED***
  }

  /** @internal */
  get _columnLabel(): string {
    return this.type === 'ux' ? 'UX support' : 'Dev support';
  }
}
