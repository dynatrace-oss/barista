import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { DtActiveFilterChangeEvent, DtFilterFieldFilterNode, DtFilterFieldValueProperty } from '@dynatrace/angular-components';
import { FILTER_FIELD_EXAMPLE_DATA, ComplexType, isAutocomplete, getViewValue, AutocompleteItemType, isGroup, ItemType, isFreeText } from './data';

function filterItems(items: AutocompleteItemType[], needle: string): AutocompleteItemType[] {
  if (needle.length) {
    const neeldeUC = needle.toLocaleUpperCase();
    return items
      .map((item: AutocompleteItemType) => isGroup(item) ? {
        name: item.name,
        // tslint:disable-next-line:no-any
        group: filterItems(item.group, needle) as any[],
      } : item)
      .filter((item: AutocompleteItemType) =>
        (isGroup(item) ? !!item.group.length : getViewValue(item).toUpperCase().indexOf(neeldeUC) !== -1));
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
@OriginalClassName('DefaultFilterFieldExample')
export class DefaultFilterFieldExample {
  _inputValue = '';

  private _currentItem: ComplexType | null = FILTER_FIELD_EXAMPLE_DATA;

  get filteredAutocompleteItems(): AutocompleteItemType[] | null {
    if (isAutocomplete(this._currentItem)) {
      return filterItems(this._currentItem.autocomplete, this._inputValue);
    } else if (isFreeText(this._currentItem) && this._currentItem.suggestions.length) {
      return filterItems(this._currentItem.suggestions, this._inputValue);
    }
    return null;
  }

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
    this._currentItem = FILTER_FIELD_EXAMPLE_DATA;
  }
}
