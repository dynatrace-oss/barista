/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

export class SelectionModel<T> {
  /** Currently selected items */
  private _selection = new Set<T>();

  /**
   * Cached array of selected items
   * to avoid having to call Array.from every time the getter is called
   */
  get selected(): T[] {
    if (!this._selected) {
      this._selected = Array.from(this._selection.values());
    }

    return this._selected.sort();
  }
  private _selected: T[] | null;

  constructor(private _multiple: boolean, initialSelection?: T[]) {
    if (initialSelection && initialSelection.length) {
      if (this._multiple) {
        initialSelection.forEach((item) => this.select(item));
      } else {
        this.select(initialSelection[0]);
      }
    }
  }

  /**
   * Selects items
   * @param items Items to select
   */
  select(...items: T[]): void {
    items.forEach((item) => {
      this._selectItem(item);
    });
  }

  /**
   * Deselect items
   * @param items Items to deselect
   */
  deselect(...items: T[]): void {
    items.forEach((item) => this._selection.delete(item));
    this._selectionChanged();
  }

  /**
   * Toggle items
   * @param items Items to toggle
   */
  toggle(...items: T[]): void {
    items.forEach((item) => {
      if (this._selection.has(item)) {
        this.deselect(item);
      } else {
        this._selectItem(item);
      }
    });
  }

  /** Clear selection */
  clear(): void {
    this._selection.clear();
  }

  /** Check if item is selected */
  isSelected(item: T): boolean {
    return this._selection.has(item);
  }

  /**
   * Selects an item if it is not already selected
   * Clears the selection first if multiselection is disabled
   * @param item Item to select
   */
  private _selectItem(item: T): void {
    if (!this.isSelected(item)) {
      if (!this._multiple) {
        this.clear();
      }

      this._selection.add(item);
      this._selectionChanged();
    }
  }

  /** Reset cached array of selected items */
  private _selectionChanged(): void {
    this._selected = null;
  }
}
