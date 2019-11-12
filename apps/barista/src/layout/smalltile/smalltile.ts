import { Component, Input } from '@angular/core';

import { BaIndexPageItem } from '../../shared/page-contents';

@Component({
  selector: 'ba-smalltile',
  templateUrl: 'smalltile.html',
  styleUrls: ['smalltile.scss'],
  host: {
    '[class.ba-smalltile-link-wrapper]': 'data',
  },
})
export class BaSmallTile {
  @Input() data: BaIndexPageItem;
}
