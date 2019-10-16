import { Component } from '@angular/core';
import { BaSinglePageContents } from 'shared/page-contents';

import { BaPage } from '../page-outlet';

@Component({
  selector: 'ba-single-page',
  templateUrl: 'single-page.html',
})
export class BaSinglePage implements BaPage {
  contents: BaSinglePageContents;
}
