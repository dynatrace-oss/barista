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
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DtCheckboxChange } from '@dynatrace/barista-components/checkbox';
import {
  DtAutocompleteValue,
  DtNodeDef,
  isDtOptionDef,
  isDtRenderType,
} from '@dynatrace/barista-components/filter-field';
import { DtRadioChange } from '@dynatrace/barista-components/radio';
import { take } from 'rxjs/operators';
import { buildIdPathsFromFilters } from './quick-filter-utils';
import {
  Action,
  addFilter,
  removeFilter,
  showGroupInDetailView,
  unsetFilterGroup,
  updateFilter,
} from './state/actions';
import {
  coerceNumberProperty,
  BooleanInput,
  NumberInput,
  coerceBooleanProperty,
} from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';

/** @internal The DtQuickFilterGroup is an internal component */
@Component({
  selector: 'dt-quick-filter-group',
  templateUrl: './quick-filter-group.html',
  styleUrls: ['./quick-filter-group.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    class: 'dt-quick-filter-group',
  },
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DtQuickFilterGroup<T = any> implements AfterViewInit {
  /** @internal Emits a new action that changes the filter  */
  @Output() readonly filterChange = new EventEmitter<Action>();

  /** @internal template to render a multi select option */
  @ViewChild('checkBox', { static: true })
  _checkBoxTemplate: TemplateRef<DtNodeDef>;
  /** @internal template to render a distinct option */
  @ViewChild('radioButton', { static: true })
  _radioButtonTemplate: TemplateRef<DtNodeDef>;
  /** @internal Default template for the show more context */
  @ViewChild('defaultShowMoreText', { static: true })
  _defaultShowMoreTemplate: TemplateRef<number>;

  /** @internal The aria-level of the group headlines for the document outline. */
  @Input()
  get groupHeadlineRole(): number {
    return this._groupHeadlineRole;
  }
  set groupHeadlineRole(value: number) {
    this._groupHeadlineRole = coerceNumberProperty(value);
  }
  private _groupHeadlineRole = 3;
  static ngAcceptInputType_groupHeadlineRole: NumberInput;

  /** @internal The height for the virtual scroll container needs a fixed height */
  @Input()
  get virtualScrollHeight(): number {
    return this._virtualScrollHeight;
  }
  set virtualScrollHeight(value: number) {
    this._virtualScrollHeight = coerceNumberProperty(value);
  }
  private _virtualScrollHeight = 0;
  static ngAcceptInputType_virtualScrollHeight: NumberInput;

  /** @internal Template for the show more text of the group */
  @Input() showMoreTemplate: TemplateRef<{ $implicit: number; group: string }>;

  /**
   * @internal
   * If the view is the detail view of the show more
   */
  @Input()
  get isDetail(): boolean {
    return this._isDetail;
  }
  set isDetail(detail: boolean) {
    this._isDetail = coerceBooleanProperty(detail);
    this._options = this._getOptions(this._nodeDef);
  }
  private _isDetail = false;
  static ngAcceptInputType_isDetail: BooleanInput;

  /**
   * @internal
   * The maximum amount of items that should be displayed in the quick filter
   * sidebar. If there are more they are hidden behind a show more functionality
   */
  @Input()
  get maxGroupItems(): number {
    return this._maxGroupItems;
  }
  set maxGroupItems(value: number) {
    this._maxGroupItems = coerceNumberProperty(value);
  }
  private _maxGroupItems = Infinity;
  static ngAcceptInputType_maxGroupItems: NumberInput;

  /** @internal The nodeDef of the autocomplete that should be rendered */
  @Input()
  set nodeDef(def: DtNodeDef) {
    this._nodeDef = def;
    this._options = this._getOptions(this._nodeDef);
  }

  /** @internal The list of all active filters */
  @Input()
  set activeFilters(filters: DtAutocompleteValue<T>[][]) {
    this._activeFilterPaths = buildIdPathsFromFilters(filters || []);
    this._options = this._getOptions(this._nodeDef);
    this._changeDetectorRef.markForCheck();
  }

  /**
   * @internal
   * Detect if the nodeDef of the autocomplete is distinct.
   * Needed to differentiate between radios or checkboxes.
   */
  get _isDistinct(): boolean {
    return !!this._nodeDef.autocomplete?.distinct;
  }

  /** @internal The template for the group items */
  get _itemTemplate(): TemplateRef<DtNodeDef> {
    if (this._isDistinct) {
      return this._radioButtonTemplate;
    }
    return this._checkBoxTemplate;
  }

  /** @internal The nodeDef of the autocomplete that should be rendered */
  _nodeDef: DtNodeDef;
  /**
   * @internal
   * Holds all options that can be displayed.
   * They can only be displayed if it is an option of an autocomplete that
   * is not a render type, so it only has a text.
   */
  _options: DtNodeDef[] = [];
  /** @internal If the group items are truncated and hidden behind a show more */
  _truncatedGroupItems = false;
  /** @internal The count of the truncated items */
  _showMoreCount = 0;
  /**
   * @internal
   * The item size of one item for the virtual scroll container
   * Default 22 as it is a standard height of a checkbox
   */
  _itemSize = 22;

  /** A list of active filter ids */
  private _activeFilterPaths: string[] = [];

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef<HTMLElement>,
    private _zone: NgZone,
    private _platform: Platform,
  ) {}

  ngAfterViewInit(): void {
    this._zone.onStable.pipe(take(1)).subscribe(() => {
      const item = this._elementRef.nativeElement.querySelector(
        '.dt-radio-button,.dt-checkbox',
      ) as HTMLElement;
      if (this._platform.isBrowser) {
        this._itemSize = item?.getBoundingClientRect().height || 22;
      } else {
        this._itemSize = 22;
      }
    });
  }

  /** @internal Show all items from the group */
  _showMore(): void {
    this.filterChange.emit(
      showGroupInDetailView(this._nodeDef.option?.uid || undefined),
    );
  }

  /** @internal Method that is used to unset a whole filter group */
  _unsetGroup(): void {
    this.filterChange.emit(unsetFilterGroup(this._nodeDef));
  }

  /** @internal Updates a radio box */
  _selectOption(change: DtRadioChange<DtNodeDef>): void {
    if (change.value) {
      this.filterChange.emit(updateFilter([this._nodeDef, change.value]));
    }
  }

  /** @internal Select or deselect a checkbox */
  _selectCheckBox(change: DtCheckboxChange<DtNodeDef>): void {
    const action = change.checked
      ? addFilter([this._nodeDef, change.source.value])
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        removeFilter(change.source.value.option!.uid!);
    this.filterChange.emit(action);
  }

  /** @internal Helper function that checks if nothing is selected inside a group */
  _isNothingSelected(): boolean {
    if (this._nodeDef.option && this._nodeDef.option.uid) {
      const index = this._activeFilterPaths.findIndex((path) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        path.startsWith(this._nodeDef.option!.uid!),
      );
      return index === -1;
    }
    return false;
  }

  /** @internal Helper function that checks if an option is active */
  _isActive(node: DtNodeDef): boolean {
    return !!(
      node.option && this._activeFilterPaths.includes(node.option.uid || '')
    );
  }

  /** @internal Helper function that returns safely the viewValue of a nodeDef */
  _getViewValue(nodeDef: DtNodeDef): string {
    return nodeDef?.option?.viewValue || '';
  }

  /**
   * @internal
   * Helper function that returns all options that can be displayed.
   * They can only be displayed if it is an option of an autocomplete that
   * is not a render type so only have a text.
   */
  private _getOptions(nodeDef: DtNodeDef): DtNodeDef[] {
    if (nodeDef?.autocomplete) {
      const items = nodeDef.autocomplete.optionsOrGroups.filter(
        (def) => isDtOptionDef(def) && !isDtRenderType(def),
      );
      const filteredItems = items.filter(
        (item, index) => index < this.maxGroupItems || this._isActive(item),
      );
      this._showMoreCount =
        items.length - Math.max(this.maxGroupItems, filteredItems.length);
      if (!this.isDetail && this._showMoreCount > 0) {
        this._truncatedGroupItems = true;
        return filteredItems;
      } else {
        this._truncatedGroupItems = false;
      }
      return items;
    }
    return [];
  }
}
