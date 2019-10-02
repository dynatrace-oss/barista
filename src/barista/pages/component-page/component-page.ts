import { Component } from '@angular/core';
import { BaPageContents } from 'shared/page-contents';

import { BaPage } from '../page-outlet';

@Component({
  selector: 'ba-component-page',
  templateUrl: 'component-page.html',
})
export class BaComponentPage implements BaPage {
  content: BaPageContents;
}
