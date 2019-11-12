import { AfterViewInit, Component } from '@angular/core';
import { BaSinglePageContents } from 'shared/page-contents';

import { fillTableData } from '../../utils/fillTableData';
import { BaPage } from '../page-outlet';

@Component({
  selector: 'ba-single-page',
  templateUrl: 'single-page.html',
})
export class BaSinglePage implements BaPage, AfterViewInit {
  contents: BaSinglePageContents;

  ngAfterViewInit(): void {
    const allTables = Array.prototype.slice.call(
      document.querySelectorAll('table'),
    );

    /** add data attributes to each table, so it can be displayed correctly on small screens */
    for (const table of allTables) {
      fillTableData(table);
    }
  }
}
