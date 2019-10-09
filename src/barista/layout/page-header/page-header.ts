import { Component, Input } from '@angular/core';

import { environment } from './../../environments/environment';

@Component({
  selector: 'ba-page-header',
  templateUrl: 'page-header.html',
  styleUrls: ['page-header.scss'],
  host: {
    class: 'ba-page-header',
  },
})
export class BaPageHeader {
  /** the title of the current page */
  @Input() title: string;

  /** the description of the current page */
  @Input() description: string;

  /** the contributors of the component on the current page */
  @Input() contributors: {
    ux: string[];
    dev: string[];
  };

  /** additional page properties, such as deprecated, dev utility,.. */
  @Input() properties: string[];

  /** @internal the link to the component on the current page has a link to the wiki page */
  @Input() wiki: string;

  /** @internal whether the component on the current page is themeable */
  @Input() themable: boolean;

  /** @internal */
  get _showContributors(): boolean {
    return (
      environment.internal &&
      this.contributors &&
      this.contributors.dev.length + this.contributors.ux.length > 0
    );
  }
}
