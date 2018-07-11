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
  OnDestroy,
  forwardRef,
} from '@angular/core';
import { DtTab, DtTabChange } from './tab';
import { mixinColor, mixinDisabled, DtLoggerFactory, DtLogger } from '@dynatrace/angular-components/core';
import { Subscription, merge } from 'rxjs';

export const DT_TABGROUP_SINGLE_TAB_ERROR = 'Only one single tab is not allowed inside a tabgroup';

export const DT_TABGROUP_NO_ENABLED_TABS_ERROR = 'At least one tab must be enabled at all times';

const LOG: DtLogger = DtLoggerFactory.create('DtTabGroup');

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
export class DtTabGroup extends _DtTabGroupMixinBase implements AfterContentInit, OnDestroy {
  // tslint:disable-next-line:no-forward-ref
  @ContentChildren(forwardRef(() => DtTab)) _tabs: QueryList<DtTab>;

  /** Subscription to tabs being added/removed. */
  private _tabsSubscription = Subscription.EMPTY;

  /** Subscription to the state of a tab */
  private _tabStateSubscription = Subscription.EMPTY;

  private _selected: DtTab | null = null;
  _groupId = `dt-tab-group-${++nextId}`;

  @Input()
  get selected(): DtTab | null { return this._selected; }
  set selected(selected: DtTab | null) {
    this._selected = selected;
    this._setSelectedTab();
  }

  // tslint:disable-next-line:no-output-named-after-standard-event
  @Output() readonly change = new EventEmitter<DtTabChange>();

  constructor(elementRef: ElementRef, private _changeDetectorRef: ChangeDetectorRef) {
    super(elementRef);
  }

  _setSelectedTab(): void {
    if (this._selected && !this._selected.selected) {
      this._selected.selected = true;
    }
  }

  /** Dispatch change event with current selection */
  _emitChangeEvent(): void {
    this.change.emit({ source: this._selected!, index: 0 }); //TODO: set correct index
  }

  ngAfterContentInit(): void {
    /** subscribe to initial tab state changes */
    this._subscribeToTabStateChanges();
    this._selectFirstEnabledTab();
    // Subscribe to changes in the amount of tabs, in order to be
    // able to re-render the content as new tabs are added or removed.
    this._tabsSubscription = this._tabs.changes.subscribe(() => {
      if (this._tabs.length <= 1) {
        LOG.error(DT_TABGROUP_SINGLE_TAB_ERROR);
      }
      // if selected tab got removed
      if (!this._tabs.find((tab) => tab === this.selected)) {
        this._selectFirstEnabledTab();
      }
      this._subscribeToTabStateChanges();
      /** this is necessary so the loop with the portaloutlets gets rerendered */
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._tabsSubscription.unsubscribe();
  }

  private _subscribeToTabStateChanges(): void {
    if (this._tabStateSubscription) { this._tabStateSubscription.unsubscribe(); }
    this._tabStateSubscription = merge(...this._tabs.map((tab) => tab.stateChanges))
    .subscribe(() => {
      console.log('state changes fired');
      /** check if the selected tab is disabled now */
      if (this.selected && this.selected.disabled) {
        console.log('selected tab got disabled');
        this._selected = null;
        this._selectFirstEnabledTab();
      }
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * Verifies that at least 2 tabs exist and at least one is enabled
   */
  private _verifyTabs(): void {
    if (this._tabs.length <= 1) {
      LOG.error(DT_TABGROUP_SINGLE_TAB_ERROR);
    }
  }

  private _selectFirstEnabledTab(): void {
    if (this._tabs) {
      const hasEnabledTabs = this._tabs.filter((t) => !t.disabled).length > 0;
      if (!hasEnabledTabs) {
        LOG.error(DT_TABGROUP_NO_ENABLED_TABS_ERROR);
      }
      if (hasEnabledTabs && !this._tabs.find((t) => t === this.selected)) {
        console.log('need to find first enabled tab');
        const firstEnabled = this._findFirstEnabledTab();
        if (firstEnabled) {
          firstEnabled!.selected = true;
        }
      }
    }
  }

  /**
   * Returns the first enabled tab
   */
  private _findFirstEnabledTab(): DtTab | undefined {
    return this._tabs.find((t: DtTab, idx: number) => {
      if (!t.disabled) {
        return true;
      }
      return false;
    });
  }
}
