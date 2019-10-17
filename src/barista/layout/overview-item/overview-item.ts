import { Component, Input } from '@angular/core';
import { BaOverviewPageSectionItem } from 'shared/page-contents';

@Component({
  selector: 'ba-overview-item',
  templateUrl: 'overview-item.html',
  styleUrls: ['overview-item.scss'],
})
export class BaOverviewItem {
  @Input() data: BaOverviewPageSectionItem;

  @Input() listView = true;

  get _cssClassComponentState(): string {
    if (
      this.data.badge &&
      (this.data.badge === 'experimental' || this.data.badge === 'deprecated')
    ) {
      return `ba-overview-item-badge-warning`;
    }

    if (this.data.badge) {
      return `ba-overview-item-badge-${this.data.badge}`;
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
}
