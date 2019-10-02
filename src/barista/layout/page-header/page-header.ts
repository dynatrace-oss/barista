import { Component, Input } from '@angular/core';

import { environment } from './../../environments/environment';

@Component({
  selector: 'ba-page-header',
  templateUrl: 'page-header.html',
  styleUrls: ['page-header.scss'],
  host: {
    class: 'ba-page__header',
  },
})
export class BaPageHeader {
  @Input() title: string;
  @Input() description: string;
  @Input() contributors: {
    ux: string[];
    dev: string[];
  };
  @Input() properties: string[];

  /** @internal */
  _hasPropertiesList(): boolean {
    // TODO: also check for themable, deprecated, wiki link
    return this.properties.length > 0;
  }

  /** @internal */
  get _showContributors(): boolean {
    return (
      environment.internal &&
      this.contributors.dev.length + this.contributors.ux.length > 0
    );
  }
}
