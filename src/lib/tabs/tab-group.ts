import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  QueryList,
  ContentChildren,
  Output,
  EventEmitter,
  AfterContentInit,
} from '@angular/core';
import { DtTab } from './tab';

export class DtTabChangeEvent<T> {
  /** Index of the currently-selected tab. */
  index: number;
  /** Reference to the currently-selected tab. */
  tab: DtTab<T>;
}

@Component({
  moduleId: module.id,
  selector: 'dt-tab-group',
  exportAs: 'dtTabGroup',
  templateUrl: 'tab-group.html',
  styleUrls: ['tab-group.scss'],
  host: {
    class: 'dt-tab-group',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTabGroup<T> implements AfterContentInit {
  @ContentChildren(DtTab) _tabs: QueryList<DtTab<T>>;

  /** Event emitted when the tab selection has changed. */
  @Output() readonly selectedTabChange: EventEmitter<DtTabChangeEvent<T>> =
      new EventEmitter<DtTabChangeEvent<T>>(true);

  /** Handle click events, setting new selected index if appropriate. */
  _handleClick(tab: DtTab<T>, idx: number): void {
    if (!tab.disabled) {
      // this.selectedIndex = idx;
    }
  }

  ngAfterContentInit(): void {
    console.log(this._tabs);
  }
}
