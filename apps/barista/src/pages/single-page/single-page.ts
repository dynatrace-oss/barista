import { BaPage } from '../page-outlet';
import { BaSinglePageContents } from '../../shared/page-contents';
import { Component } from '@angular/core';

@Component({
  selector: 'ba-single-page',
  templateUrl: 'single-page.html',
})
export class BaSinglePage implements BaPage {
  contents: BaSinglePageContents;
}
