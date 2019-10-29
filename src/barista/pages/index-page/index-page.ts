import { Component } from '@angular/core';
import { BaIndexPageContents } from 'shared/page-contents';

import { environment } from './../../environments/environment';
import { BaPage } from '../page-outlet';

@Component({
  selector: 'ba-index-page',
  templateUrl: 'index-page.html',
  styleUrls: ['index-page.scss'],
})
export class BaIndexPage implements BaPage {
  contents: BaIndexPageContents;

  /** @internal whether the internal content should be displayed */
  _internal = environment.internal;
}
