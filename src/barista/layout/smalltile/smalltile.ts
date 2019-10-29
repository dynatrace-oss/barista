import { Component, Input } from '@angular/core';
import { BaIndexPageItem } from 'shared/page-contents';

@Component({
  selector: 'a[ba-smalltile]',
  templateUrl: 'smalltile.html',
  styleUrls: ['smalltile.scss'],
  host: {
    '[href]': 'data.link',
    '[class]': 'data.isEmpty? "ba-smalltile-empty" : "ba-smalltile"',
  },
})
export class BaSmallTile {
  @Input() data: BaIndexPageItem;
}
