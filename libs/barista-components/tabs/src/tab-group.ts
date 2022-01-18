/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import {
  CanColor,
  CanDisable,
  Constructor,
  DtLogger,
  DtLoggerFactory,
  mixinColor,
  mixinDisabled,
} from '@dynatrace/barista-components/core';
import { merge, Subscription } from 'rxjs';
import { DtTab, DtTabChange } from './tab/tab';

export const DT_TABGROUP_SINGLE_TAB_ERROR =
  'Only one single tab is not allowed inside a tabgroup';

export const DT_TABGROUP_NO_ENABLED_TABS_ERROR =
  'At least one tab must be enabled at all times';

const LOG: DtLogger = DtLoggerFactory.create('DtTabGroup');

export type DtTabGroupThemePalette = 'main' | 'recovered' | 'error';

export class DtTabGroupBase {
  constructor(public _elementRef: ElementRef) {}
}
export const _DtTabGroupMixinBase = mixinDisabled(
  mixinColor<Constructor<DtTabGroupBase>, DtTabGroupThemePalette>(
    DtTabGroupBase,
    'main',
  ),
);

/** Used to generate unique ID's for each tab component */
let nextId = 0;

@Component({
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
export class DtTabGroup
  extends _DtTabGroupMixinBase
  implements
    AfterContentInit,
    OnDestroy,
    CanColor<DtTabGroupThemePalette>,
    CanDisable
{
  /** @internal List of all the tabs of this group */
  @ContentChildren(DtTab) _tabs: QueryList<DtTab>;

  /** Subscription to tabs being added/removed. */
  private _tabsSubscription = Subscription.EMPTY;

  /** Subscription to the state of a tab */
  private _tabStateSubscription = Subscription.EMPTY;

  /** @internal The currently selected tab */
  _selected: DtTab | null = null;
  /** @internal Used to notify only the tabs in the same tab-group */
  _groupId = `dt-tab-group-${++nextId}`;

  /** Emits an event every time the selected tab changes */
  @Output() readonly selectionChanged = new EventEmitter<DtTabChange>();

  /** The currently registered tabs on the tabgroup */
  get tabs(): DtTab[] {
    return this._tabs ? this._tabs.toArray() : [];
  }

  constructor(
    elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    super(elementRef);
  }

  ngAfterContentInit(): void {
    /** subscribe to initial tab state changes */
    this._validateTabs();
    this._subscribeToTabStateChanges();
    this._selectTab();
    // Subscribe to changes in the amount of tabs, in order to be
    // able to re-render the content as new tabs are added or removed.
    this._tabsSubscription = this._tabs.changes.subscribe(() => {
      this._validateTabs();
      // if selected tab got removed - select the first enabled again
      if (!this._tabs.find((tab) => tab === this._selected)) {
        this._selectTab();
      }
      // after tabs changed we need to subscribe again
      this._subscribeToTabStateChanges();
      /** this is necessary so the loop with the portaloutlets gets rerendered */
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._tabsSubscription.unsubscribe();
  }

  /** @internal Dispatch change event with current selection - dispatched inside the tab */
  _tabChange(selected: DtTab, isUserInteraction: boolean): void {
    /** unselect all other tabs */
    this._selected = selected;
    if (this._tabs) {
      this._tabs
        .filter((tab) => tab !== selected)
        .forEach((tab) => {
          tab._deselect();
        });
    }
    this.selectionChanged.emit({ source: this._selected, isUserInteraction });
    this._changeDetectorRef.markForCheck();
  }

  /** @internal Returns a unique id for each tab content element */
  _getTabContentId(tabId: string): string {
    return `${this._groupId}-content-${tabId}`;
  }

  /**
   * Subscribes to state changes of all tabs
   * this is necessary so we get notified when the inputs of the tab change
   * we need to trigger change detection on the group since the group needs to render the header again
   */
  private _subscribeToTabStateChanges(): void {
    if (this._tabStateSubscription) {
      this._tabStateSubscription.unsubscribe();
    }
    this._tabStateSubscription = merge(
      ...this._tabs.map((tab) => tab._stateChanges),
    ).subscribe(() => {
      /** check if the selected tab is disabled now */
      if (this._selected && this._selected.disabled) {
        this._selected = null;
        this._selectTab();
      }
      this._changeDetectorRef.markForCheck();
    });
  }

  /** @internal Selects the tab  */
  _selectTab(): void {
    if (this._tabs) {
      const hasEnabledTabs = this._tabs.some((t) => !t.disabled);
      if (!hasEnabledTabs) {
        LOG.error(DT_TABGROUP_NO_ENABLED_TABS_ERROR);
        return;
      }
      const selectedTabNotFound = !this._tabs.find((t) => t === this._selected);
      if (selectedTabNotFound) {
        const firstEnabled = this._findFirstEnabledTab();
        if (firstEnabled) {
          firstEnabled._select(false);
        }
      }
    }
  }

  /**
   * Returns the first enabled tab
   */
  private _findFirstEnabledTab(): DtTab | undefined {
    return this._tabs.find((t: DtTab) => !t.disabled);
  }

  /** Check that more than one tab is available */
  private _validateTabs(): void {
    if (this._tabs.length <= 1) {
      LOG.error(DT_TABGROUP_SINGLE_TAB_ERROR);
    }
  }
}
