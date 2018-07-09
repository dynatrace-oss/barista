import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  QueryList,
  ContentChildren,
  Output,
  EventEmitter,
  AfterContentInit,
  Input,
  ElementRef,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { DtTab } from './tab';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { mixinColor, mixinDisabled } from '@dynatrace/angular-components/core';

export class DtTabChangeEvent<T> {
  /** Index of the currently-selected tab. */
  index: number;
  /** Reference to the currently-selected tab. */
  tab: DtTab<T>;
}

export class DtTabGroupBase {
  constructor(public _elementRef: ElementRef) {}
}
export const _DtTabGroupMixinBase = mixinColor(mixinDisabled(DtTabGroupBase), 'main');

/** Used to generate unique ID's for each tab component */
let nextId = 0;

@Component({
  moduleId: module.id,
  selector: 'dt-tab-group',
  exportAs: 'dtTabGroup',
  templateUrl: 'tab-group.html',
  styleUrls: ['tab-group.scss'],
  host: {
    class: 'dt-tab-group',
    role: 'tablist',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTabGroup<T> extends _DtTabGroupMixinBase implements AfterContentChecked, AfterContentInit {
  @ContentChildren(DtTab) _tabs: QueryList<DtTab<T>>;

  /** Event emitted when the tab selection has changed. */
  @Output() readonly selectedTabChange: EventEmitter<DtTabChangeEvent<T>> =
      new EventEmitter<DtTabChangeEvent<T>>(true);

  /** The index of the active tab. */
  @Input()
  get selectedIndex(): number | null { return this._selectedIndex; }
  set selectedIndex(value: number | null) {
    this._indexToSelect = coerceNumberProperty(value, null);
  }
  private _selectedIndex: number | null = null;

  /** The tab index that should be selected after the content has been checked. */
  private _indexToSelect: number | null = null;

  private _groupId: number;

  constructor(elementRef: ElementRef, private _changeDetectorRef: ChangeDetectorRef) {
    super(elementRef);
    this._groupId = nextId++;
}

  /** Handle click events, setting new selected index if appropriate. */
  _handleClick(tab: DtTab<T>, idx: number): void {
    if (!tab.disabled) {
      this.selectedIndex = idx;
    }
  }

  ngAfterContentChecked(): void {
    let indexToSelect = this._indexToSelect;
    if (this._indexToSelect === null) {
      // get all indices of non disabled tabs
      this._tabs.find((t: DtTab<T>, idx: number) => {
        if (!t.disabled) {
          indexToSelect = idx;
          return true;
        }
        return false;
      });
      // no enabled tabs found so return
      if (indexToSelect === undefined) { return; }
    }

    // set the first enabled tab to active
    this._indexToSelect = indexToSelect;

    if (this._selectedIndex !== indexToSelect && this._selectedIndex !== null) {
      const tabChangeEvent = this._createChangeEvent(indexToSelect!);
      this.selectedTabChange.emit(tabChangeEvent);
    }

    // Setup the active tab
    this._tabs.forEach((tab: DtTab<T>, index: number) => {
      tab.isActive = index === indexToSelect;
    });

    if (this._selectedIndex !== indexToSelect) {
      this._selectedIndex = indexToSelect;
      this._changeDetectorRef.markForCheck();
    }
  }

  ngAfterContentInit(): void {
    // this._subscribeToTabLabels();

    // Subscribe to changes in the amount of tabs, in order to be
    // able to re-render the content as new tabs are added or removed.
    // this._tabsSubscription = this._tabs.changes.subscribe(() => {
    //   const tabs = this._tabs.toArray();

    //   // Maintain the previously-selected tab if a new tab is added or removed.
    //   for (let i = 0; i < tabs.length; i++) {
    //     if (tabs[i].isActive) {
    //       this._indexToSelect = i;
    //       break;
    //     }
    //   }

    //   // this._subscribeToTabLabels();
    //   this._changeDetectorRef.markForCheck();
    // });
  }

  private _createChangeEvent(index: number): DtTabChangeEvent<T> {
    const event = new DtTabChangeEvent<T>();
    event.index = index;
    if (this._tabs && this._tabs.length) {
      event.tab = this._tabs.toArray()[index];
    }
    return event;
  }

}
