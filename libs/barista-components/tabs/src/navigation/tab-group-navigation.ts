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

import { AfterContentInit, Directive, OnDestroy, Self } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DtTabGroup } from '../tab-group';
import { DtTab, DtTabChange } from '../tab/tab';
import {
  DtTabGroupNavigationControl,
  DtTabNavigationAdapter,
} from './tab-navigation-adapter';

/**
 * Directive that hooks up the tabgroup for navigation
 */
@Directive({
  selector: 'dt-tab-group[dtTabGroupNavigation]',
  exportAs: 'dtTabGroupNavigation',
})
export class DtTabGroupNavigation
  implements DtTabGroupNavigationControl, OnDestroy, AfterContentInit
{
  private _destroyed = new Subject<void>();

  constructor(
    @Self() private _tabGroup: DtTabGroup,
    private _tabNavigationAdapter: DtTabNavigationAdapter,
  ) {}

  ngAfterContentInit(): void {
    /** subscribes to selectionchanges and notifies navigation adapter on user interaction triggered changes */
    this._tabGroup.selectionChanged
      .pipe(takeUntil(this._destroyed))
      .subscribe((event: DtTabChange) => {
        if (event.isUserInteraction) {
          const toRemove = this._getTabs()
            .filter((tab) => tab !== event.source)
            .map((tab) => tab.id);
          this._tabNavigationAdapter.update(event.source.id, toRemove);
        }
      });

    this._tabNavigationAdapter.registerTabControl(this);
  }

  ngOnDestroy(): void {
    this._tabNavigationAdapter.unregisterTabControl(this);
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** @internal Adapter calls this function with ids - selects the tab for these ids */
  _updateWithTabIds(ids: string[]): void {
    const tabs = this._getTabs();
    if (tabs) {
      const matchingTab = tabs.find((tab) => !!ids.find((id) => tab.id === id));
      if (matchingTab && !matchingTab.disabled) {
        tabs.forEach((tab) => {
          if (ids.includes(tab.id)) {
            tab._select(false);
          } else {
            tab._deselect();
          }
        });
      } else {
        this._tabGroup._selectTab();
      }
    }
  }

  /** Returns the tabgroup tabs as array */
  private _getTabs(): DtTab[] {
    return this._tabGroup ? this._tabGroup._tabs.toArray() : [];
  }
}
