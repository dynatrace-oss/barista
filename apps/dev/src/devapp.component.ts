/**
 * @license
 * Copyright 2021 Dynatrace LLC
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
  Input,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface NavItem {
  name: string;
  route: string;
}

@Component({
  selector: 'dev-app',
  styleUrls: ['devapp.component.scss'],
  templateUrl: 'devapp.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevApp implements AfterContentInit, OnDestroy {
  navItems: NavItem[] = [
    { name: 'Alert', route: '/alert' },
    { name: 'Autocomplete', route: '/autocomplete' },
    { name: 'Bar indicator', route: '/bar-indicator' },
    { name: 'Breadcrumbs', route: '/breadcrumbs' },
    { name: 'Button', route: '/button' },
    { name: 'Button-group', route: '/button-group' },
    { name: 'Card', route: '/card' },
    { name: 'Chart', route: '/chart' },
    { name: 'Checkbox', route: '/checkbox' },
    { name: 'Combobox', route: '/combobox' },
    { name: 'Confirmation-dialog', route: '/confirmation-dialog' },
    { name: 'Consumption', route: '/consumption' },
    {
      name: 'Container-breakpoint-observer',
      route: '/container-breakpoint-observer',
    },
    { name: 'Context-dialog', route: '/context-dialog' },
    { name: 'Copy-to-clipboard', route: '/copy-to-clipboard' },
    { name: 'Datepicker', route: '/datepicker' },
    { name: 'Drawer', route: '/drawer' },
    { name: 'Drawer-table', route: '/drawer-table' },
    { name: 'Empty-state', route: '/empty-state' },
    { name: 'Event-chart', route: '/event-chart' },
    { name: 'Expandable-panel', route: '/expandable-panel' },
    { name: 'Expandable-section', route: '/expandable-section' },
    { name: 'Expandable-text', route: '/expandable-text' },
    { name: 'Filter-field', route: '/filter-field' },
    { name: 'Form-field', route: '/form-field' },
    { name: 'Formatters', route: '/formatters' },
    { name: 'Highlight', route: '/highlight' },
    { name: 'Icon', route: '/icon' },
    { name: 'Indicator', route: '/indicator' },
    { name: 'Info-group', route: '/info-group' },
    { name: 'Inline-editor', route: '/inline-editor' },
    { name: 'Input', route: '/input' },
    { name: 'Key-value-list', route: '/key-value-list' },
    { name: 'Legend', route: '/legend' },
    { name: 'Link', route: '/link' },
    { name: 'Loading-distractor', route: '/loading-distractor' },
    { name: 'Menu', route: '/menu' },
    { name: 'Micro-chart', route: '/micro-chart' },
    { name: 'Overlay', route: '/overlay' },
    { name: 'Pagination', route: '/pagination' },
    { name: 'Progress-bar', route: '/progress-bar' },
    { name: 'Progress-circle', route: '/progress-circle' },
    { name: 'Quick-Filter', route: '/quick-filter' },
    { name: 'Radial-chart', route: '/radial-chart' },
    { name: 'Radio', route: '/radio' },
    { name: 'Secondary-nav', route: '/secondary-nav' },
    { name: 'Select', route: '/select' },
    { name: 'Show-more', route: '/show-more' },
    { name: 'Stacked-series-chart', route: '/stacked-series-chart' },
    { name: 'Stepper', route: '/stepper' },
    { name: 'Slider', route: '/slider' },
    { name: 'Sunburst-chart', route: '/sunburst-chart' },
    { name: 'Switch', route: '/switch' },
    { name: 'Table', route: '/table' },
    { name: 'Table Order', route: '/table-order' },
    { name: 'Tabs', route: '/tabs' },
    { name: 'Tag', route: '/tag' },
    { name: 'Tile', route: '/tile' },
    { name: 'Timeline-chart', route: '/timeline-chart' },
    { name: 'Toggle-button-group', route: '/toggle-button-group' },
    { name: 'Toast', route: '/toast' },
    { name: 'Top-bar-navigation', route: '/top-bar-navigation' },
    { name: 'TreeTable', route: '/tree-table' },
  ];
  selectedTheme = 'turquoise';
  themes = [
    { value: 'turquoise', name: 'Turquoise' },
    { value: 'turquoise:dark', name: 'Turquoise dark' },
    { value: 'blue', name: 'Blue' },
    { value: 'blue:dark', name: 'Blue dark' },
    { value: 'purple', name: 'Purple' },
    { value: 'purple:dark', name: 'Purple dark' },
    { value: 'royalblue', name: 'Royalblue' },
    { value: 'royalblue:dark', name: 'Royalblue dark' },
  ];

  private _navItemsFilterValue = '';
  private _filteredNavItems = [...this.navItems];
  private _zoneStableCounter = 0;
  private _zoneStableCounterTimer;
  private _zoneCounterEl: HTMLElement;
  private _destroy$ = new Subject<void>();

  @Input('navItemValue')
  get navItemsFilterValue(): string {
    return this._navItemsFilterValue;
  }
  set navItemsFilterValue(value: string) {
    const filterValue = value.trim();

    if (this._navItemsFilterValue !== filterValue) {
      this._navItemsFilterValue = filterValue;
      this._updateFilteredNavItems();
    }
  }

  get filteredNavItems(): NavItem[] {
    return this._filteredNavItems;
  }

  constructor(
    private readonly _router: Router,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    zone: NgZone,
  ) {
    zone.onStable.pipe(takeUntil(this._destroy$)).subscribe(() => {
      // Run counter itself outside the zone to be sure that
      // the counter (timer) does not influence the zone.
      zone.runOutsideAngular(() => {
        this._increaseZoneStable();
      });
    });
  }

  ngAfterContentInit(): void {
    this._router.events.pipe(takeUntil(this._destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.document.body.scrollIntoView(true);
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _updateFilteredNavItems(): void {
    if (this._navItemsFilterValue.length === 0) {
      this._filteredNavItems = [...this.navItems];
    } else {
      const filterValue = this._navItemsFilterValue.toLocaleLowerCase();

      this._filteredNavItems = this.navItems.filter((navItem) =>
        navItem.name.toLocaleLowerCase().includes(filterValue),
      );
    }

    this._changeDetectorRef.markForCheck();
  }

  private _increaseZoneStable(): void {
    let el = this._zoneCounterEl;
    if (!el) {
      // eslint-disable-next-line
      el = document.createElement('code');
      el.className = 'dev-app-zone-counter';
      document.body.appendChild(el);
      this._zoneCounterEl = el;
    }
    el.textContent = (++this._zoneStableCounter).toString();
    el.classList.add('dev-app-zone-counter-firing');
    clearTimeout(this._zoneStableCounterTimer);
    this._zoneStableCounterTimer = setTimeout(() => {
      el.classList.remove('dev-app-zone-counter-firing');
    }, 200);
  }
}
