import { Component, ElementRef, Input } from '@angular/core';
import { BaOverviewPageSectionItem } from 'shared/page-contents';

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

  /** @internal get a css class according to the value of the badge */
  get _cssClassComponentState(): string {
    if (
      this.data.badge &&
      (this.data.badge === 'experimental' || this.data.badge === 'deprecated')
    ) {
      return `ba-tile-badge-warning`;
    }

    if (this.data.badge) {
      return `ba-tile-badge-${this.data.badge}`;
    }
    return '';
  }

  /** @internal whether the tile has the badge 'favorite' */
  get _favorite(): boolean {
    return (this.data.badge && this.data.badge === 'favorite') || false;
  }

  /** @internal whether the tile has the badge 'workinprogress' */
  get _workinprogress(): boolean {
    return (this.data.badge && this.data.badge === 'workinprogress') || false;
  }

  /** @internal whether the tile has the badge 'deprecated' */
  get _deprecated(): boolean {
    return (this.data.badge && this.data.badge === 'deprecated') || false;
  }

  /** @internal whether the tile has the badge 'experimental' */
  get _experimental(): boolean {
    return (this.data.badge && this.data.badge === 'experimental') || false;
  }

  constructor(private _elementRef: ElementRef) {}

  /** set the focus on the nativeElement */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }
}
