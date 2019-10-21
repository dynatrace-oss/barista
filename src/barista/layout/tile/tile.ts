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

  get _favorite(): boolean {
    if (this.data.badge && this.data.badge === 'favorite') {
      return true;
    }
    return false;
  }

  get _workinprogress(): boolean {
    if (this.data.badge && this.data.badge === 'workinprogress') {
      return true;
    }
    return false;
  }
  get _deprecated(): boolean {
    if (this.data.badge && this.data.badge === 'deprecated') {
      return true;
    }
    return false;
  }

  get _experimental(): boolean {
    if (this.data.badge && this.data.badge === 'experimental') {
      return true;
    }
    return false;
  }

  constructor(private _elementRef: ElementRef) {}

  focus(): void {
    this._elementRef.nativeElement.focus();
  }
}
