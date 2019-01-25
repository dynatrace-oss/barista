import { Component } from '@angular/core';
import {
  DtActiveFilterChangeEvent,
  DtFilterFieldFilterNode,
  DtFilterFieldValueProperty,
  DtToast
} from '@dynatrace/angular-components';
import { FILTER_FIELD_EXAMPLE_DATA, ComplexType, isAutocomplete, getViewValue, AutocompleteItemType, isGroup, ItemType, isFreeText } from './data';

function filterItems(items: AutocompleteItemType[], needle: string): AutocompleteItemType[] {
  if (needle.length) {
    const needleUC = needle.toLocaleUpperCase();
    return items
      .map((item: AutocompleteItemType) => isGroup(item) ? {
        name: item.name,
        // tslint:disable-next-line:no-any
        group: filterItems(item.group, needle) as any[],
      } : item)
      .filter((item: AutocompleteItemType) =>
        (isGroup(item) ? !!item.group.length : getViewValue(item).toUpperCase().indexOf(needleUC) !== -1));
  }
  return items;
}

@Component({
  moduleId: module.id,
  template: `
    <dt-filter-field
      (inputChange)="_inputValue = $event"
      (activeFilterChange)="_handleActiveFilterChange($event)"
      label="Filter by">
      <dt-autocomplete *ngIf="filteredAutocompleteItems" [displayWith]="displayFn" autoActiveFirstOption>
        <ng-container *ngFor="let item of filteredAutocompleteItems">
          <dt-optgroup *ngIf="item.group; else options" [label]="item.name">
            <dt-option *ngFor="let groupItem of item.group" [value]="groupItem">{{displayFn(groupItem)}}</dt-option>
          </dt-optgroup>
          <ng-template #options>
            <dt-option [value]="item">{{displayFn(item)}}</dt-option>
          </ng-template>
        </ng-container>
      </dt-autocomplete>
    </dt-filter-field>
  `,
})
export class DefaultFilterFieldExample {
  _inputValue = '';

  private _currentItem: ComplexType | null = FILTER_FIELD_EXAMPLE_DATA;
  private _autocompleteOptions: AutocompleteItemType[] | null;
  private _lastInputValue: string;
  private _lastItem: ComplexType | null = FILTER_FIELD_EXAMPLE_DATA;

  get filteredAutocompleteItems(): AutocompleteItemType[] | null {
    if (this._inputValue !== this._lastInputValue || this._currentItem !== this._lastItem) {
      if (isAutocomplete(this._currentItem)) {
        this._autocompleteOptions = filterItems(this._currentItem.autocomplete, this._inputValue);
      } else if (isFreeText(this._currentItem) && this._currentItem.suggestions.length) {
        this._autocompleteOptions = filterItems(this._currentItem.suggestions, this._inputValue);
      } else {
        this._autocompleteOptions = null;
      }
      this._lastItem = this._currentItem;
      this._lastInputValue = this._inputValue;
    }
    return this._autocompleteOptions;
  }

  constructor(private _toast: DtToast) {}

  // tslint:disable-next-line:no-any
  displayFn = (value: any) => getViewValue(value);

  _handleActiveFilterChange(event: DtActiveFilterChangeEvent): void {
    const activeNode = event.activeNode as DtFilterFieldFilterNode;
    if (activeNode) {
      if (activeNode.properties.length) {
        const item = (activeNode.properties[activeNode.properties.length - 1] as DtFilterFieldValueProperty<ItemType>).value;
        if (isAutocomplete(item)) {
          this._currentItem = item;
          return;
        } else if (isFreeText(item)) {
          this._currentItem = item;
          return;
        }
      }
      event.submitActiveFilter();
    }
    this._toast.create(event.rootNodes.length > 0 ? event.rootNodes.map((x) => ` [${x}] `).toString() : '<no filter applied>');
    this._currentItem = FILTER_FIELD_EXAMPLE_DATA;
  }
}
