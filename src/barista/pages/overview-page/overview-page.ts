import { Component } from '@angular/core';
import { BaPage } from 'pages/page-outlet';
import { BaOverviewPageContents } from 'shared/page-contents';

@Component({
  selector: 'ba-overview-page',
  templateUrl: 'overview-page.html',
  styleUrls: ['overview-page.scss'],
})
export class BaOverviewPage implements BaPage {
  contents: BaOverviewPageContents;
}
