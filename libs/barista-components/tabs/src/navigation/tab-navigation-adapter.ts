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
  HashLocationStrategy,
  Location,
  LocationStrategy,
} from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { DtLogger, DtLoggerFactory } from '@dynatrace/barista-components/core';

import { DtTabsRouterFragmentBuilder } from './tab-fragment-builder';

const LOG: DtLogger = DtLoggerFactory.create('DtTabRouterFragmentAdapter');

/** Interface for the controls that register with the adapter */
export interface DtTabGroupNavigationControl {
  _updateWithTabIds(tabIds: string[]): void;
}

/**
 * Abstract service class for the DtTabNavigationAdapter
 * extend from this class for creating your own logic for storing navigation information of tabs
 * make sure to provide the deps for your implementation
 */
@Injectable({ providedIn: 'root' })
export abstract class DtTabNavigationAdapter {
  /** Registers a tabcontrol with the adapater */
  abstract registerTabControl(control: DtTabGroupNavigationControl): void;

  /** Unregister a tabcontrol with the adapter */
  abstract unregisterTabControl(control: DtTabGroupNavigationControl): void;

  /** Updates the stored values in the hash navigation */
  abstract update(id: string, idsToRemove: string[]): void;
}

/**
 * Adapter for storing/reading tab navigation information in the url fragment
 */
export class DtTabRouterFragmentAdapter extends DtTabNavigationAdapter {
  private _controls = new Set<DtTabGroupNavigationControl>();
  private _tabIds = new Set<string>();

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _location: Location,
    private _locationStrategy: LocationStrategy,
  ) {
    super();
    /** store tabIds from fragment and update  */
    _route.fragment
      .pipe(filter((fragment) => !!fragment))
      .subscribe((fragmentText) => {
        const ids = (fragmentText ?? '')
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean);
        this._tabIds = new Set(ids);
        this._controls.forEach((control) => {
          control._updateWithTabIds(ids);
        });
      });
  }

  /** Registers a tabcontrol with the adapater */
  registerTabControl(control: DtTabGroupNavigationControl): void {
    if (this._controls.has(control)) {
      LOG.info(
        `You are trying to register a DtTabGroupNavigationControl that is already registerd`,
      );
    }
    this._controls.add(control);
    control._updateWithTabIds(Array.from(this._tabIds));
  }

  /** Unregister a tabcontrol with the adapter */
  unregisterTabControl(control: DtTabGroupNavigationControl): void {
    if (!this._controls.has(control)) {
      LOG.info(
        `You are trying to unregister a not yet registerd DtTabGroupNavigationControl`,
      );
    }
    this._controls.delete(control);
  }

  /**
   * Updates the stored values in the hash navigation
   * takes one id that is added to the navigation and an array of ids to remove,
   * basically one tab gets added and all other tabs in the same tab group get removed
   * requires pathlocationstrategy to be used
   */
  update(id: string, idsToRemove: string[]): void {
    const usesHashLocationStrategy =
      this._locationStrategy instanceof HashLocationStrategy;
    if (!usesHashLocationStrategy) {
      idsToRemove.forEach((i) => {
        this._tabIds.delete(i);
      });
      this._tabIds.add(id);
      this._updateRouterFragment();
    }
  }

  /** Updates the router fragment */
  private _updateRouterFragment(): void {
    const fragment = DtTabsRouterFragmentBuilder.build(this._tabIds);
    const url = this._router
      .createUrlTree([], { relativeTo: this._route, fragment })
      .toString();
    this._location.go(url);
  }
}
