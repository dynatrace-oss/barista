import { Component, ElementRef, Input } from '@angular/core';

import { BaOverviewPageSectionItem } from '../../shared/page-contents';

@Component({
  selector: 'a[ba-tile]',
  templateUrl: 'tile.html',
  styleUrls: ['tile.scss'],
  host: {
    '[href]': 'data.link',
    class: 'ba-tile',
  },
})
export class BaTile {
  @Input() data: BaOverviewPageSectionItem;
  @Input() listView = true;

  private favorite = false;
  private deprecated = false;
  private experimental = false;
  private workinprogress = false;
  private hasBadge = false;

  /** @internal whether the tile has the badge 'favorite' */
  get _favorite(): boolean {
    this.setBadge();
    return this.favorite;
  }

  /** @internal whether the tile has the badge 'workinprogress' */
  get _workinprogress(): boolean {
    this.setBadge();
    return this.workinprogress;
  }

  /** @internal whether the tile has the badge 'deprecated' */
  get _deprecated(): boolean {
    this.setBadge();
    return this.deprecated;
  }

  /** @internal whether the tile has the badge 'experimental' */
  get _experimental(): boolean {
    this.setBadge();
    return this.experimental;
  }

  get _hasBadge(): boolean {
    this.setBadge();
    return this.hasBadge;
  }

  private setBadge(): void {
    this.favorite = false;
    this.hasBadge = false;
    this.deprecated = false;
    this.experimental = false;

    if (this.data.badge && this.data.badge.includes('favorite')) {
      this.favorite = true;
      this.hasBadge = true;
    } else if (this.data.badge && this.data.badge.includes('deprecated')) {
      this.deprecated = true;
      this.hasBadge = true;
    } else if (this.data.badge && this.data.badge.includes('experimental')) {
      this.experimental = true;
      this.hasBadge = true;
    } else if (
      this.data.badge &&
      this.data.badge.includes('work in progress')
    ) {
      this.workinprogress = true;
      this.hasBadge = true;
    }
  }

  constructor(private _elementRef: ElementRef) {}

  /** set the focus on the nativeElement */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }
}
