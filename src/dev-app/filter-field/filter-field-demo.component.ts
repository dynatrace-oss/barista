import { Component } from '@angular/core';
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
  selector: 'filter-field-demo',
  templateUrl: './filter-field-demo.component.html',
  styleUrls: ['./filter-field-demo.component.scss'],
})
export class FilterFieldDemo {
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
