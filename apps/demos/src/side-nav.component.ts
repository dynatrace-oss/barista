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
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface ComponentItem {
  name: string;
  expanded?: boolean;
  examples: Array<{ name: string; route: string }>;
}

/** Key under which the current filter is being persisted into the session storage. */
const FILTER_SESSION_STORAGE_KEY = 'demos-filter';

@Component({
  selector: 'dt-demos-side-nav',
  templateUrl: 'side-nav.component.html',
  styleUrls: ['side-nav.component.scss'],
  host: {
    class: 'dt-demos-side-nav',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtDemosSideNav implements AfterContentInit, OnDestroy {
  @Input()
  get componentItems(): ComponentItem[] {
    return this._componentItems;
  }
  set componentItems(values: ComponentItem[]) {
    this._componentItems = values;
    this._createExampleSuggestionsSource();
    this._updateFilteredComponentItems();
  }

  @Input('componentItemValue')
  get componentItemsFilterValue(): string {
    return this._componentItemsFilterValue;
  }
  set componentItemsFilterValue(value: string) {
    const filterValue = value.trim();

    if (this._componentItemsFilterValue !== filterValue) {
      this._componentItemsFilterValue = filterValue;
      this._updateFilteredComponentItems();

      if (window && window.sessionStorage) {
        window.sessionStorage.setItem(FILTER_SESSION_STORAGE_KEY, filterValue);
      }
    }
  }

  get filteredComponentItems(): ComponentItem[] {
    return this._filteredComponentItems;
  }

  /** Array of examples that are listed in the suggestions */
  exampleSuggestionsSource: string[] = [];

  /** Array of examples that are listed in the suggestions */
  exampleSuggestions: string[] = [];

  private _selectedComponentName = '';
  private _componentItemsFilterValue = '';
  private _urlSubscription: Subscription;
  private _componentItems: ComponentItem[] = [];
  private _filteredComponentItems: ComponentItem[] = [];

  constructor(
    private readonly _router: Router,
    private readonly _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngAfterContentInit(): void {
    this._filteredComponentItems = [...this._componentItems];
    this._urlSubscription = this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._selectedComponentName = event.urlAfterRedirects.replace(
          /^\/?([A-Za-z0-9-]+)\/?.*$/,
          '$1',
        );
        this._changeDetectorRef.markForCheck();

        window.document.body.scrollIntoView(true);
      }
    });

    if (window && window.sessionStorage) {
      const savedFilter =
        window.sessionStorage.getItem(FILTER_SESSION_STORAGE_KEY) || '';
      this.componentItemsFilterValue = savedFilter;
    }
  }

  ngOnDestroy(): void {
    this._urlSubscription.unsubscribe();
  }

  /** @internal Whether the provided component is the selected one. */
  _isSelectedComponent(componentName: string): boolean {
    return this._selectedComponentName === componentName;
  }

  /** Update the filtered elements for render in the sidebar. */
  private _updateFilteredComponentItems(): void {
    if (this._componentItemsFilterValue.length === 0) {
      this._filteredComponentItems = [...this._componentItems];
      this.exampleSuggestions = this.exampleSuggestionsSource;
    } else {
      const filterValue = this._componentItemsFilterValue.toLocaleLowerCase();

      this.exampleSuggestions = this.exampleSuggestionsSource.filter(
        (suggestion) => suggestion.toLocaleLowerCase().includes(filterValue),
      );

      this._filteredComponentItems = this._componentItems
        .map((componentItem) => {
          const filteredExamples = componentItem.examples.filter((example) =>
            example.name.includes(filterValue),
          );
          if (filteredExamples.length > 0) {
            return {
              ...componentItem,
              examples: filteredExamples,
              expanded: true,
            };
          }
        })
        .filter(Boolean) as ComponentItem[];
    }

    this._changeDetectorRef.markForCheck();
  }

  /**
   * Create a flat representation of all examples in their component groups
   * to provide them as suggestions in the autocomplete.
   */
  private _createExampleSuggestionsSource(): void {
    if (this.componentItems) {
      this.exampleSuggestionsSource = Object.values(this.componentItems).reduce<
        string[]
      >((aggregator, componentGroup) => {
        aggregator.push(
          ...componentGroup.examples.map((example) => example.name),
        );
        return aggregator;
      }, []);
    }
  }
}
