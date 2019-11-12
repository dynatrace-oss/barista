import { BaIndexPageContents } from '../../shared/page-contents';
import { BaPage } from '../page-outlet';
import { Component } from '@angular/core';
import { environment } from './../../environments/environment';

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
